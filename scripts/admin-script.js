// PROPER FIX for Chrome extension async response error
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                // Handle the message synchronously if possible
                console.log('Chrome extension message received:', message);

                // Always send an immediate response
                sendResponse({ received: true, success: true });

                // Return false to indicate we won't respond asynchronously
                return false;
            });
        }
        // Authentication check for admin panel
        const ADMIN_API_BASE = 'http://localhost:3000/api';

        async function checkAdminAuth() {
            const token = localStorage.getItem('adminToken');

            if (!token) {
                redirectToLogin();
                return false;
            }

            try {
                const response = await fetch(`${ADMIN_API_BASE}/admin/verify`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Invalid token');
                }

                return true;
            } catch (error) {
                console.error('Auth check failed:', error);
                redirectToLogin();
                return false;
            }
        }

        function redirectToLogin() {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = 'admin.login.html';
        }

        function addAuthHeader(headers = {}) {
            const token = localStorage.getItem('adminToken');
            return {
                ...headers,
                'Authorization': `Bearer ${token}`
            };
        }

        // New function that includes authentication headers
        async function fetchWithAuth(url, options = {}) {
            const authHeaders = addAuthHeader(options.headers || {});

            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders
                }
            });

            if (response.status === 401 || response.status === 403) {
                redirectToLogin();
                throw new Error('Authentication required');
            }

            return response;
        }


        // API Base URL
        const API_BASE = 'http://localhost:3000/api';
        // const API_BASE = 'http://192.168.0.109:3000/api';

        // Global state
        let menuItems = [];
        let orders = [];
        let serviceRequests = [];
        let reviews = [];
        let lastOrderCount = 0;
        let unreadNotifications = 0;
        let isFirstLoad = true;
        let lastServiceRequestCount = 0;
        let unreadServiceNotifications = 0;
        // Search functionality
        let searchTimeout;
        let allMenuItems = [];

        // DOM Elements
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const tabLinks = document.querySelectorAll('.sidebar-menu a');
        const tabContents = document.querySelectorAll('.tab-content');

        // Initialize admin dashboard
        async function initAdmin() {
            console.log('Initializing admin dashboard...');

            if (!await checkAdminAuth()) return;

            // Initialize notification system first
            await initializeNotificationSystem();
            await fetchDashboardData();
            await fetchMenuItems();
            await fetchServiceRequests(); // This will set initial count
            await fetchReviews();
            await fetchOrders(); // This will set initial count
            console.log('Admin initialized with', orders.length, 'orders and', serviceRequests.length, 'service requests');

            console.log('Admin initialized with full functionality');

            // Set up periodic updates
            setInterval(fetchDashboardData, 15000);
            setInterval(fetchOrders, 3000);
            setInterval(fetchServiceRequests, 10000); // Check service requests every 10 seconds

            // Reset first load flag after everything is loaded
            setTimeout(() => {
                isFirstLoad = false;
                console.log('First load completed - notifications enabled');
            }, 2000);
        }

        // Initialize notification system
        async function initializeNotificationSystem() {
            console.log('Initializing notification system...');

            const sound = document.getElementById('notification-sound');
            if (sound) {
                sound.muted = false;
                sound.volume = 0.3;

                // Pre-load and warm up the audio
                try {
                    await sound.load();
                    console.log('Notification sound loaded successfully');
                } catch (error) {
                    console.log('Sound pre-load failed:', error);
                }
            }

            // Add click handler to enable audio
            document.addEventListener('click', function enableAudio() {
                console.log('User interaction detected - audio enabled');
                if (sound) {
                    sound.play().then(() => {
                        sound.pause();
                        sound.currentTime = 0;
                    }).catch(e => console.log('Audio warm-up failed:', e));
                }
                document.removeEventListener('click', enableAudio);
            }, { once: true });
        }

        // API Functions
        async function fetchDashboardData() {
            try {
                const response = await fetchWithAuth(`${API_BASE}/admin/dashboard`);
                if (response.ok) {
                    const data = await response.json();
                    updateDashboardUI(data);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        }

        async function fetchOrders() {
            try {
                const response = await fetchWithAuth(`${API_BASE}/orders`);
                if (response.ok) {
                    const newOrders = await response.json();

                    // Sort orders by creation date (newest first)
                    const sortedNewOrders = [...newOrders].sort((a, b) =>
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );

                    console.log('Orders fetched:', sortedNewOrders.length, 'Previous:', orders.length);

                    // Store old count before updating
                    const oldOrderCount = orders.length;

                    // Update orders array
                    orders = sortedNewOrders;

                    // Make sure menu items are loaded before rendering
                    if (menuItems.length === 0) {
                        await fetchMenuItems();
                    }

                    // Render tables
                    renderOrdersTable();
                    renderKitchenOrders();

                    // Check for new orders
                    if (!isFirstLoad) {
                        checkForNewOrders(oldOrderCount, sortedNewOrders);
                    } else {
                        // First load - don't notify for existing orders
                        console.log('First load, skipping notifications for existing orders');
                        isFirstLoad = false;
                    }

                    // Update lastOrderCount for next check
                    lastOrderCount = sortedNewOrders.length;
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }

        async function fetchMenuItems() {
            try {
                const response = await fetchWithAuth(`${API_BASE}/menu`);
                if (response.ok) {
                    menuItems = await response.json();
                    allMenuItems = [...menuItems]; // Store for search
                    renderMenuTable();
                }
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        }

        async function fetchServiceRequests() {
            try {
                const response = await fetchWithAuth(`${API_BASE}/service-requests`);
                if (response.ok) {
                    const newServiceRequests = await response.json();

                    // Sort by creation date (newest first)
                    const sortedNewRequests = [...newServiceRequests].sort((a, b) =>
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );

                    console.log('Service requests fetched:', sortedNewRequests.length, 'Previous:', serviceRequests.length);

                    // Store old count before updating
                    const oldRequestCount = serviceRequests.length;

                    // Update serviceRequests array
                    serviceRequests = sortedNewRequests;

                    // Render the table
                    renderServiceRequestsTable();

                    // Check for new service requests
                    if (!isFirstLoad) {
                        checkForNewServiceRequests(oldRequestCount, sortedNewRequests);
                    }

                }
            } catch (error) {
                console.error('Error fetching service requests:', error);
            }
        }

        async function fetchReviews() {
            try {
                const response = await fetchWithAuth(`${API_BASE}/reviews`);
                if (response.ok) {
                    reviews = await response.json();
                    renderRatingsTable();
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        }

        // Sales Reports Functions
        async function fetchSalesReport(period = 'today') {
            try {
                const response = await fetchWithAuth(`${API_BASE}/admin/sales-report?period=${period}`);
                if (response.ok) {
                    const reportData = await response.json();
                    updateSalesReportUI(reportData);
                } else {
                    console.error('Failed to fetch sales report');
                }
            } catch (error) {
                console.error('Error fetching sales report:', error);
            }
        }

        function updateSalesReportUI(reportData) {
            // Update report cards
            const reportCards = document.querySelectorAll('#report-cards .card-content');
            if (reportCards.length >= 3) {
                reportCards[0].textContent = reportData.totalOrders || 0;
                reportCards[1].textContent = `₹${reportData.totalSales || 0}`;
                reportCards[2].textContent = `₹${(reportData.avgOrderValue || 0).toFixed(2)}`;
            }

            // Update popular items table
            renderPopularItems(reportData.popularItems);

            console.log('Sales report updated for period:', reportData.period);
        }

        function renderPopularItems(popularItems) {
            const tbody = document.getElementById('popular-items-body');
            if (!tbody) return;

            tbody.innerHTML = '';

            if (!popularItems || popularItems.length === 0) {
                tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px; color: var(--text-light);">
                    No items sold in this period
                </td>
            </tr>
        `;
                return;
            }

            popularItems.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.orders}</td>
            <td>₹${item.revenue}</td>
        `;
                tbody.appendChild(row);
            });
        }

        // Export functionality - REPLACE THE EXISTING FUNCTION WITH THIS
        // Enhanced export functionality with better error handling
        function exportReport() {
            try {
                const period = document.getElementById('report-period').value;
                const reportCards = document.querySelectorAll('#report-cards .card-content');


                // Get report data
                const reportData = {
                    period: period,
                    totalOrders: reportCards[0].textContent,
                    totalSales: reportCards[1].textContent.replace('₹', ''),
                    avgOrderValue: reportCards[2].textContent.replace('₹', ''),
                    exportedAt: new Date().toLocaleString()
                };

                // Create CSV content
                const csvContent = createCSVContent(reportData);

                // Create download
                downloadCSV(csvContent, `sales-report-${period}-${Date.now()}.csv`);

                alert(`✅ Report for ${period} exported successfully!`);

            } catch (error) {
                console.error('Export error:', error);
                alert('❌ Failed to export report. Please try again.');
            }
        }

        function createCSVContent(reportData) {
            let csv = "MAHER CHINESE - SALES REPORT\n";
            csv += "==============================\n\n";
            csv += `Report Period: ${reportData.period}\n`;
            csv += `Exported: ${reportData.exportedAt}\n\n`;

            csv += "SUMMARY\n";
            csv += "-------\n";
            csv += "Metric,Value\n";
            csv += `Total Orders,${reportData.totalOrders}\n`;
            csv += `Total Sales (₹),${reportData.totalSales}\n`;
            csv += `Average Order Value (₹),${reportData.avgOrderValue}\n\n`;

            // Add popular items if available
            const popularItemsBody = document.getElementById('popular-items-body');
            if (popularItemsBody && popularItemsBody.children.length > 0) {
                csv += "POPULAR ITEMS\n";
                csv += "-------------\n";
                csv += "Item Name,Category,Quantity,Revenue (₹)\n";

                const rows = popularItemsBody.querySelectorAll('tr');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length === 4) {
                        const name = `"${cells[0].textContent}"`;
                        const category = `"${cells[1].textContent}"`;
                        const quantity = cells[2].textContent;
                        const revenue = cells[3].textContent.replace('₹', '');
                        csv += `${name},${category},${quantity},${revenue}\n`;
                    }
                });
            }

            return csv;
        }

        function downloadCSV(csvContent, filename) {
            // Create blob
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

            // Create download link
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.display = 'none';

            // Add to page, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }




        // UI Update Functions
        function updateDashboardUI(data) {
            const todayOrdersEl = document.getElementById('today-orders');
            const todaySalesEl = document.getElementById('today-sales');
            const activeTablesEl = document.getElementById('active-tables');
            const avgRatingEl = document.getElementById('avg-rating');
            const ordersFooterEl = document.getElementById('orders-footer');
            const serviceRequestsFooterEl = document.getElementById('service-requests-footer');
            const reviewsFooterEl = document.getElementById('reviews-footer');

            if (todayOrdersEl) todayOrdersEl.textContent = data.todayOrders || 0;
            if (todaySalesEl) todaySalesEl.textContent = `₹${data.todaySales || 0}`;
            if (activeTablesEl) activeTablesEl.textContent = data.activeTables || 0;
            if (avgRatingEl) avgRatingEl.textContent = `${data.averageRating || 0}/5`;
            if (ordersFooterEl) ordersFooterEl.textContent = `${data.pendingOrders || 0} pending orders`;
            if (serviceRequestsFooterEl) serviceRequestsFooterEl.textContent = `${data.activeServiceRequests || 0} service requests`;
            if (reviewsFooterEl) reviewsFooterEl.textContent = `Based on ${data.totalReviews || 0} reviews`;
        }

        function renderOrdersTable() {
            const tbody = document.getElementById('orders-table-body');
            if (!tbody) return;

            tbody.innerHTML = '';

            const recentOrders = orders.slice(0, 20);

            if (recentOrders.length === 0) {
                tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 20px; color: var(--text-light);">
                        No orders found. Orders will appear here when customers place them.
                    </td>
                </tr>
            `;
                return;
            }

            recentOrders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.table || 'N/A'}</td>
                <td class="order-items-cell" data-order-id="${order.id}" title="Click to view order details">
                    ${getOrderItemsText(order.items)}
                </td>
                <td>₹${order.total || 0}</td>
                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                <td>${new Date(order.createdAt).toLocaleTimeString()}</td>
                <td>
    <div class="orders-table-actions">
        <select class="status-select" data-order-id="${order.id}">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
            <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
            <option value="served" ${order.status === 'served' ? 'selected' : ''}>Served</option>
        </select>
        <button class="btn btn-danger delete-order" data-order-id="${order.id}" title="Delete Order">
            <i class="fas fa-trash"></i>
        </button>
    </div>
</td>
            `;
                tbody.appendChild(row);
            });

            // Add event listeners
            document.querySelectorAll('.order-items-cell').forEach(cell => {
                cell.addEventListener('click', function () {
                    const orderId = this.getAttribute('data-order-id');
                    const order = orders.find(o => o.id === orderId);
                    if (order) {
                        renderOrderDetails(order);
                    }
                });
            });

            document.querySelectorAll('.status-select').forEach(select => {
                select.addEventListener('change', function () {
                    updateOrderStatus(this.dataset.orderId, this.value);
                });
            });
            // Add event listeners for delete buttons
            document.querySelectorAll('.delete-order').forEach(btn => {
                btn.addEventListener('click', function () {
                    const orderId = this.dataset.orderId;
                    deleteOrder(orderId);
                });
            });
        }

        function renderKitchenOrders() {
            const kitchenBody = document.getElementById('kitchen-orders-body');
            const completedBody = document.getElementById('completed-orders-body');

            if (!kitchenBody || !completedBody) return;

            kitchenBody.innerHTML = '';
            completedBody.innerHTML = '';

            const activeOrders = orders.filter(order =>
                order.status === 'pending' || order.status === 'preparing'
            );

            const completedOrders = orders.filter(order =>
                order.status === 'ready' || order.status === 'served'
            ).slice(0, 10);

            // Kitchen orders
            if (activeOrders.length === 0) {
                kitchenBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px; color: var(--text-light);">
                        No active orders in kitchen
                    </td>
                </tr>
            `;
            } else {
                activeOrders.forEach(order => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.table}</td>
                    <td>${getOrderItemsList(order.items)}</td>
                    <td>${order.notes || '-'}</td>
                    <td>${new Date(order.createdAt).toLocaleTimeString()}</td>
                    <td>
                        ${order.status === 'pending' ?
                            `<button class="btn btn-primary start-order" data-order-id="${order.id}">
                                <i class="fas fa-utensils"></i> Start
                            </button>` :
                            `<button class="btn btn-success complete-order" data-order-id="${order.id}">
                                <i class="fas fa-check"></i> Ready
                            </button>`}
                    </td>
                `;
                    kitchenBody.appendChild(row);
                });
            }

            // Completed orders
            if (completedOrders.length === 0) {
                completedBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px; color: var(--text-light);">
                        No completed orders
                    </td>
                </tr>
            `;
            } else {
                completedOrders.forEach(order => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.table}</td>
                    <td>${getOrderItemsText(order.items)}</td>
                    <td>${new Date(order.updatedAt || order.createdAt).toLocaleTimeString()}</td>
                    <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                `;
                    completedBody.appendChild(row);
                });
            }

            // Add event listeners
            document.querySelectorAll('.start-order').forEach(btn => {
                btn.addEventListener('click', function () {
                    updateOrderStatus(this.dataset.orderId, 'preparing');
                });
            });

            document.querySelectorAll('.complete-order').forEach(btn => {
                btn.addEventListener('click', function () {
                    updateOrderStatus(this.dataset.orderId, 'ready');
                });
            });
        }

        function renderMenuTable() {
            const tbody = document.getElementById('menu-table-body');
            if (!tbody) return;

            tbody.innerHTML = '';

            if (menuItems.length === 0) {
                tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px; color: var(--text-light);">
                        No menu items found
                    </td>
                </tr>
            `;
                return;
            }

            menuItems.forEach(item => {
                const row = document.createElement('tr');
                if (!item.available) {
                    row.classList.add('out-of-stock');
                }

                const basePrice = item.variations && item.variations.length > 0 ?
                    Math.min(...item.variations.map(v => v.price)) : item.price || 0;

                row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>₹${basePrice}</td>
                <td>${item.veg ? 'Veg' : 'Non-Veg'}</td>
                <td>
                    <label class="availability-toggle">
                        <div class="toggle-switch">
                            <input type="checkbox" ${item.available ? 'checked' : ''} 
                                onchange="toggleItemAvailability(${item.id}, this.checked)">
                            <span class="toggle-slider"></span>
                        </div>
                        <span>${item.available ? 'Available' : 'Out of Stock'}</span>
                    </label>
                </td>
                <td>
                    <button class="btn btn-outline" onclick="editMenuItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteMenuItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
                tbody.appendChild(row);
            });
        }

        function renderServiceRequestsTable() {
            const tbody = document.getElementById('service-requests-body');
            if (!tbody) return;

            tbody.innerHTML = '';

            const pendingRequests = serviceRequests.filter(req => req.status === 'pending')
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            if (pendingRequests.length === 0) {
                tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px; color: var(--text-light);">
                        No pending service requests
                    </td>
                </tr>
            `;
                return;
            }

            pendingRequests.forEach(request => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${request.id}</td>
                <td>${request.table}</td>
                <td>${getFriendlyRequestType(request.type)}</td>
                <td>${new Date(request.createdAt).toLocaleString()}</td>
                <td><span class="status-badge status-pending">Pending</span></td>
                <td>
                    <button class="btn btn-success resolve-request" data-request-id="${request.id}">
                        <i class="fas fa-check"></i> Resolve
                    </button>
                </td>
            `;
                tbody.appendChild(row);
            });

            document.querySelectorAll('.resolve-request').forEach(btn => {
                btn.addEventListener('click', function () {
                    resolveServiceRequest(this.dataset.requestId);
                });
            });
        }

        function renderRatingsTable() {
            const tbody = document.getElementById('ratings-body');
            if (!tbody) return;

            tbody.innerHTML = '';

            const recentReviews = reviews.slice(0, 10).sort((a, b) =>
                new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
            );

            if (recentReviews.length === 0) {
                tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 20px; color: var(--text-light);">
                        No reviews yet
                    </td>
                </tr>
            `;
                return;
            }

            recentReviews.forEach(review => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${new Date(review.createdAt || review.date).toLocaleDateString()}</td>
                <td>${review.table || 'N/A'}</td>
                <td>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</td>
                <td>${review.comment || 'No comment'}</td>
            `;
                tbody.appendChild(row);
            });
        }

        // Helper Functions
        function getOrderItemsText(items) {
            if (!items || Object.keys(items).length === 0) return 'No items';

            let totalItems = 0;
            for (const itemId in items) {
                const itemData = items[itemId];
                if (itemData && itemData.variations) {
                    for (const variationType in itemData.variations) {
                        totalItems += itemData.variations[variationType] || 0;
                    }
                }
            }

            return `${totalItems} item${totalItems !== 1 ? 's' : ''} - Click to view details`;
        }

        function getOrderItemsList(items) {
            if (!items || Object.keys(items).length === 0) return 'No items';

            const itemsList = [];

            for (const itemId in items) {
                const itemData = items[itemId];
                const menuItem = menuItems.find(item => item.id === parseInt(itemId));
                const itemName = menuItem ? menuItem.name : `Item ${itemId}`;

                if (itemData && itemData.variations) {
                    for (const variationType in itemData.variations) {
                        const qty = itemData.variations[variationType];
                        if (qty > 0) {
                            const variationDisplay = variationType !== 'standard' ? ` - ${variationType}` : '';
                            itemsList.push(`• ${itemName}${variationDisplay} (${qty})`);
                        }
                    }
                }
            }

            if (itemsList.length === 0) return 'No items';
            return `<ul style="list-style-type: none; margin: 0; padding: 0;">${itemsList.map(item => `<li>${item}</li>`).join('')}</ul>`;
        }

        // Add this function to handle modal closing
        function setupModalCloseListeners() {
            // Close modal when clicking the close button
            document.querySelectorAll('.close-modal').forEach(button => {
                button.addEventListener('click', function () {
                    const modal = this.closest('.modal');
                    if (modal) {
                        modal.style.display = 'none';
                    }
                });
            });

            // Close modal when clicking outside the modal content
            document.querySelectorAll('.modal').forEach(modal => {
                modal.addEventListener('click', function (e) {
                    if (e.target === this) {
                        this.style.display = 'none';
                    }
                });
            });

            // Close modal with Escape key
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.modal').forEach(modal => {
                        modal.style.display = 'none';
                    });
                }
            });
        }

        // NEW: Update image preview
        function updateImagePreview(imageUrl) {
            const preview = document.getElementById('edit-image-preview');
            if (imageUrl) {
                preview.innerHTML = `<img src="${imageUrl}" alt="Preview" onerror="this.style.display='none'">`;
            } else {
                preview.innerHTML = '<div class="image-preview-placeholder">Image Preview</div>';
            }
        }

        // NEW: Update availability text
        function updateAvailabilityText(checkboxId) {
            const checkbox = document.getElementById(checkboxId);
            const span = checkbox.closest('.availability-toggle').querySelector('span');
            span.textContent = checkbox.checked ? 'Available' : 'Out of Stock';
        }




        // Update the renderOrderDetails function to ensure the modal can be closed
        function renderOrderDetails(order) {
            const modalContent = document.getElementById('order-details-content');
            const orderIdSpan = document.getElementById('order-details-id');
            const orderTableSpan = document.getElementById('order-details-table');
            const orderTotalSpan = document.getElementById('order-details-total');
            const orderNotesSpan = document.getElementById('order-details-notes');

            if (!modalContent || !orderIdSpan || !orderTableSpan || !orderTotalSpan || !orderNotesSpan) return;

            orderIdSpan.textContent = order.id;
            orderTableSpan.textContent = order.table;
            orderTotalSpan.textContent = order.total;
            orderNotesSpan.textContent = order.notes || 'No special instructions';

            let tableHTML = '';

            if (!order.items || Object.keys(order.items).length === 0) {
                tableHTML = '<p style="text-align: center; color: var(--text-light); padding: 20px;">No items in this order</p>';
            } else {
                tableHTML = `
            <table class="order-items-table">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Variation</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
        `;

                let grandTotal = 0;

                for (const itemId in order.items) {
                    const itemData = order.items[itemId];
                    const menuItem = menuItems.find(item => item.id === parseInt(itemId));
                    const itemName = menuItem ? menuItem.name : `Item ${itemId}`;

                    if (itemData && itemData.variations) {
                        for (const variationType in itemData.variations) {
                            const quantity = itemData.variations[variationType];
                            if (quantity > 0) {
                                const variation = menuItem ?
                                    menuItem.variations.find(v => v.type === variationType) :
                                    { price: 0 };
                                const price = variation ? variation.price : 0;
                                const itemTotal = price * quantity;
                                grandTotal += itemTotal;

                                tableHTML += `
                            <tr>
                                <td>${itemName}</td>
                                <td>${variationType.charAt(0).toUpperCase() + variationType.slice(1)}</td>
                                <td>${quantity}</td>
                                <td>₹${price}</td>
                                <td>₹${itemTotal}</td>
                            </tr>
                        `;
                            }
                        }
                    }
                }

                tableHTML += `
                </tbody>
            </table>
        `;
            }

            modalContent.innerHTML = tableHTML;

            const modal = document.getElementById('order-details-modal');
            if (modal) {
                modal.style.display = 'flex';

                // Ensure close button works for this modal
                const closeBtn = modal.querySelector('.close-modal');
                if (closeBtn) {
                    closeBtn.onclick = function () {
                        modal.style.display = 'none';
                    };
                }
            }
        }

        function getFriendlyRequestType(type) {
            const typeMap = {
                'call-waiter': 'Call Waiter 👨‍💼',
                'need-water': 'Need Water 💧',
                'need-bill': 'Need Bill 📋',
                'table-cleanup': 'Table Cleanup 🧹'
            };
            return typeMap[type] || type;
        }

        // NOTIFICATION SYSTEM
        function checkForNewOrders(oldCount, newOrders) {
            const currentOrderCount = newOrders.length;

            console.log('Order check - Old:', oldCount, 'New:', currentOrderCount);

            if (currentOrderCount > oldCount) {
                const newOrdersCount = currentOrderCount - oldCount;
                console.log(`🎉 New orders detected: ${newOrdersCount}`);

                const newOrdersList = newOrders.slice(0, newOrdersCount);

                newOrdersList.forEach(order => {
                    if (order.status === 'pending') {
                        console.log(`🔔 Showing notification for order: ${order.id} from Table ${order.table}`);
                        showNotification(order);
                    }
                });
            }
        }

        // SERVICE REQUEST NOTIFICATION SYSTEM
        function checkForNewServiceRequests(oldCount, newRequests) {
            const currentRequestCount = newRequests.length;

            console.log('Service Request check - Old:', oldCount, 'New:', currentRequestCount);

            if (currentRequestCount > oldCount) {
                const newRequestsCount = currentRequestCount - oldCount;
                console.log(`🎉 New service requests detected: ${newRequestsCount}`);

                const newRequestsList = newRequests.slice(0, newRequestsCount);

                newRequestsList.forEach(request => {
                    if (request.status === 'pending') {
                        console.log(`🔔 Showing service request notification: ${request.id} from Table ${request.table}`);
                        showServiceRequestNotification(request);
                    }
                });
            }
        }

        async function playNotificationSound() {
            try {
                const sound = document.getElementById('notification-sound');
                if (!sound) {
                    console.log('Sound element not found');
                    playFallbackSound();
                    return;
                }

                sound.muted = false;
                sound.volume = 0.5;
                sound.currentTime = 0;

                console.log('Attempting to play notification sound...');

                const playPromise = sound.play();

                if (playPromise !== undefined) {
                    await playPromise;
                    console.log('Notification sound played successfully');
                }
            } catch (error) {
                console.log('Sound playback failed, using fallback:', error);
                playFallbackSound();
            }
        }

        function playFallbackSound() {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                gainNode.gain.value = 0.1;

                oscillator.start();
                setTimeout(() => {
                    oscillator.stop();
                    setTimeout(() => {
                        if (audioContext.state !== 'closed') {
                            audioContext.close();
                        }
                    }, 100);
                }, 150);

                console.log('Fallback sound played');
            } catch (error) {
                console.log('Fallback sound also failed:', error);
            }
        }

        function showNotification(order) {
            console.log('🎯 Showing notification for order:', order.id);

            unreadNotifications++;
            updateNotificationBadge();

            const notificationTitle = document.getElementById('notification-title');
            const notificationText = document.getElementById('notification-text');

            if (notificationTitle && notificationText) {
                notificationTitle.textContent = 'New Order Received!';
                notificationText.textContent = `Table ${order.table} placed order #${order.id}`;
            }

            const toast = document.getElementById('notification-toast');
            if (toast) {
                toast.classList.add('show');
                console.log('📢 Toast notification shown');
            }

            playNotificationSound();

            const bell = document.getElementById('notification-bell');
            if (bell) {
                bell.classList.add('pulse');
                setTimeout(() => {
                    bell.classList.remove('pulse');
                }, 600);
            }

            setTimeout(() => {
                hideNotification();
            }, 5000);
        }

        function showServiceRequestNotification(request) {
            console.log('🎯 Showing service request notification:', request.id);

            unreadServiceNotifications++;
            updateServiceNotificationBadge();

            const notificationTitle = document.getElementById('notification-title');
            const notificationText = document.getElementById('notification-text');

            if (notificationTitle && notificationText) {
                notificationTitle.textContent = 'New Service Request!';
                notificationText.textContent = `Table ${request.table} - ${getFriendlyRequestType(request.type)}`;
            }

            const toast = document.getElementById('notification-toast');
            if (toast) {
                toast.style.borderLeftColor = '#f39c12'; // Orange color for service requests
                toast.classList.add('show');
                console.log('📢 Service request toast notification shown');
            }

            playNotificationSound();

            const bell = document.getElementById('notification-bell');
            if (bell) {
                bell.classList.add('pulse');
                setTimeout(() => {
                    bell.classList.remove('pulse');
                }, 600);
            }

            setTimeout(() => {
                hideNotification();
                // Reset border color
                if (toast) {
                    toast.style.borderLeftColor = '#27ae60'; // Reset to success color
                }
            }, 5000);
        }

        function hideNotification() {
            const toast = document.getElementById('notification-toast');
            if (toast) {
                toast.classList.remove('show');
            }
        }

        function updateNotificationBadge() {
            const badge = document.getElementById('notification-badge');
            if (badge) {
                if (unreadNotifications > 0) {
                    badge.textContent = unreadNotifications > 9 ? '9+' : unreadNotifications;
                    badge.style.display = 'flex';
                    console.log('🔴 Notification badge updated:', badge.textContent);
                } else {
                    badge.style.display = 'none';
                }
            }
        }

        function clearNotifications() {
            unreadNotifications = 0;
            updateNotificationBadge();
        }

        function updateServiceNotificationBadge() {
            const badge = document.getElementById('notification-badge');
            if (badge) {
                const totalNotifications = unreadNotifications + unreadServiceNotifications;
                if (totalNotifications > 0) {
                    badge.textContent = totalNotifications > 9 ? '9+' : totalNotifications;
                    badge.style.display = 'flex';
                    console.log('🔴 Total notification badge updated:', badge.textContent);
                } else {
                    badge.style.display = 'none';
                }
            }
        }

        function clearServiceNotifications() {
            unreadServiceNotifications = 0;
            updateServiceNotificationBadge();
        }


        // API Interaction Functions
        async function updateOrderStatus(orderId, status) {
            try {
                const response = await fetchWithAuth(`${API_BASE}/orders/${orderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status })
                });

                if (response.ok) {
                    await fetchOrders();
                    await fetchDashboardData();
                    console.log(`Order ${orderId} status updated to ${status}`);
                } else {
                    console.error('Failed to update order status');
                }
            } catch (error) {
                console.error('Error updating order status:', error);
            }
        }
        // NEW FUNCTION: Delete order (Fixed version)
        async function deleteOrder(orderId) {
            if (!confirm('Are you sure you want to delete this order? This action cannot be undone and will affect sales reports.')) {
                return;
            }

            try {
                const response = await fetchWithAuth(`${API_BASE}/orders/${orderId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    const result = await response.json();

                    // Remove order from local state
                    orders = orders.filter(order => order.id !== orderId);

                    // Update UI
                    renderOrdersTable();
                    renderKitchenOrders();

                    // Refresh dashboard data to update sales figures
                    await fetchDashboardData();

                    // Refresh sales report if it's currently visible
                    const reportsTab = document.getElementById('reports');
                    if (reportsTab && reportsTab.classList.contains('active')) {
                        const period = document.getElementById('report-period')?.value || 'today';
                        fetchSalesReport(period);
                    }

                    alert('Order deleted successfully');
                    console.log(`Order ${orderId} deleted`);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to delete order');
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                alert(`Failed to delete order: ${error.message}`);
            }
        }

        async function toggleItemAvailability(itemId, available) {
            try {
                const response = await fetchWithAuth(`${API_BASE}/menu/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ available })
                });

                if (response.ok) {
                    await fetchMenuItems();
                    alert(`Item ${available ? 'marked as available' : 'marked as out of stock'}`);
                } else {
                    throw new Error('Failed to update item');
                }
            } catch (error) {
                console.error('Error updating item availability:', error);
                alert('Failed to update item availability');
            }
        }

        async function resolveServiceRequest(requestId) {
            try {
                const response = await fetchWithAuth(`${API_BASE}/service-requests/${requestId}/resolve`, {
                    method: 'PUT'
                });

                if (response.ok) {
                    await fetchServiceRequests();
                    await fetchDashboardData();
                    alert('Service request resolved');
                } else {
                    alert('Failed to resolve service request');
                }
            } catch (error) {
                console.error('Error resolving service request:', error);
                alert('Failed to resolve service request');
            }
        }

        // REPLACE the existing addMenuItem function with this:
        async function addMenuItem(itemData) {
            try {
                const response = await fetchWithAuth(`${API_BASE}/menu`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(itemData)
                });

                if (response.ok) {
                    await fetchMenuItems();
                    return true;
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to add menu item');
                }
            } catch (error) {
                console.error('Error adding menu item:', error);
                alert(`Failed to add menu item: ${error.message}`);
                return false;
            }
        }

        // NEW: Edit menu item function
        async function editMenuItem(itemId) {
            const menuItem = menuItems.find(item => item.id === itemId);
            if (!menuItem) {
                alert('Menu item not found');
                return;
            }

            // Populate the edit form
            document.getElementById('edit-item-id').value = menuItem.id;
            document.getElementById('edit-item-name').value = menuItem.name;
            document.getElementById('edit-item-category').value = menuItem.category;
            document.getElementById('edit-item-description').value = menuItem.description || '';
            document.getElementById('edit-item-price').value = menuItem.price || '';
            document.getElementById('edit-item-image').value = menuItem.image || '';

            // Set food type
            const vegRadio = document.querySelector('input[name="edit-food-type"][value="veg"]');
            const nonVegRadio = document.querySelector('input[name="edit-food-type"][value="non-veg"]');
            if (menuItem.veg) {
                vegRadio.checked = true;
            } else {
                nonVegRadio.checked = true;
            }

            // Set availability
            document.getElementById('edit-item-availability').checked = menuItem.available !== false;

            // Update availability text
            updateAvailabilityText('edit-item-availability');

            // Load variations
            renderVariations(menuItem.variations || []);

            // Update image preview
            updateImagePreview(menuItem.image);

            // Show the modal
            document.getElementById('edit-item-modal').style.display = 'flex';
        }

        // NEW: Delete menu item function
        async function deleteMenuItem(itemId) {
            if (!confirm('Are you sure you want to delete this menu item? This action cannot be undone.')) {
                return;
            }

            try {
                const response = await fetchWithAuth(`${API_BASE}/menu/${itemId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    const result = await response.json();

                    // Remove from local state
                    menuItems = menuItems.filter(item => item.id !== itemId);

                    // Update UI
                    renderMenuTable();

                    alert('Menu item deleted successfully');
                    console.log(`Menu item ${itemId} deleted`);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to delete menu item');
                }
            } catch (error) {
                console.error('Error deleting menu item:', error);
                alert(`Failed to delete menu item: ${error.message}`);
            }
        }

        // NEW: Update menu item function
        async function updateMenuItem(itemData) {
            try {
                const response = await fetchWithAuth(`${API_BASE}/menu/${itemData.id}/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(itemData)
                });

                if (response.ok) {
                    const result = await response.json();
                    await fetchMenuItems(); // Refresh the menu
                    return true;
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to update menu item');
                }
            } catch (error) {
                console.error('Error updating menu item:', error);
                alert(`Failed to update menu item: ${error.message}`);
                return false;
            }
        }

        // NEW: Render variations in the edit form
        function renderVariations(variations) {
            const variationsList = document.getElementById('edit-variations-list');
            variationsList.innerHTML = '';

            if (variations && variations.length > 0) {
                variations.forEach((variation, index) => {
                    const variationElement = createVariationElement(variation, index);
                    variationsList.appendChild(variationElement);
                });
            } else {
                // Add a default variation if none exist
                const defaultVariation = createVariationElement({ type: 'standard', price: '' }, 0);
                variationsList.appendChild(defaultVariation);
            }
        }

        // NEW: Create variation input element
        function createVariationElement(variation, index) {
            const div = document.createElement('div');
            div.className = 'variation-item';
            div.innerHTML = `
        <div class="variation-details">
            <div class="form-group" style="margin-bottom: 0; flex: 1;">
                <input type="text" class="form-control variation-type" 
                       value="${variation.type}" 
                       placeholder="Variation type (e.g., half, full)" 
                       data-index="${index}">
            </div>
            <div class="form-group" style="margin-bottom: 0; flex: 1;">
                <input type="number" class="form-control variation-price" 
                       value="${variation.price}" 
                       placeholder="Price" min="0" step="0.01"
                       data-index="${index}">
            </div>
        </div>
        <button type="button" class="btn btn-danger remove-variation" data-index="${index}">
            <i class="fas fa-times"></i>
        </button>
    `;
            return div;
        }

        // NEW: Get variations data from form
        function getVariationsFromForm() {
            const variations = [];
            const typeInputs = document.querySelectorAll('.variation-type');
            const priceInputs = document.querySelectorAll('.variation-price');

            for (let i = 0; i < typeInputs.length; i++) {
                const type = typeInputs[i].value.trim();
                const price = parseFloat(priceInputs[i].value);

                if (type && !isNaN(price)) {
                    variations.push({
                        type: type,
                        price: price
                    });
                }
            }

            return variations;
        }

        // NEW: Setup all menu event listeners
        function setupMenuEventListeners() {
            // Edit form submission
            document.getElementById('edit-item-form').addEventListener('submit', async function (e) {
                e.preventDefault();

                const itemId = parseInt(document.getElementById('edit-item-id').value);
                const itemData = {
                    name: document.getElementById('edit-item-name').value,
                    category: document.getElementById('edit-item-category').value,
                    description: document.getElementById('edit-item-description').value,
                    price: parseFloat(document.getElementById('edit-item-price').value),
                    image: document.getElementById('edit-item-image').value,
                    veg: document.querySelector('input[name="edit-food-type"]:checked').value === 'veg',
                    available: document.getElementById('edit-item-availability').checked,
                    variations: getVariationsFromForm()
                };

                const success = await updateMenuItem({ id: itemId, ...itemData });
                if (success) {
                    document.getElementById('edit-item-modal').style.display = 'none';
                    alert('Menu item updated successfully!');
                }
            });

            // Add variation button
            document.getElementById('add-variation-btn').addEventListener('click', function () {
                const variationsList = document.getElementById('edit-variations-list');
                const newIndex = variationsList.children.length;
                const newVariation = createVariationElement({ type: '', price: '' }, newIndex);
                variationsList.appendChild(newVariation);
            });

            // Remove variation (event delegation)
            document.getElementById('edit-variations-list').addEventListener('click', function (e) {
                if (e.target.closest('.remove-variation')) {
                    const button = e.target.closest('.remove-variation');
                    const variationItem = button.closest('.variation-item');
                    variationItem.remove();
                }
            });

            // Image URL change preview
            document.getElementById('edit-item-image').addEventListener('input', function () {
                updateImagePreview(this.value);
            });

            // Availability toggle text update
            document.getElementById('edit-item-availability').addEventListener('change', function () {
                updateAvailabilityText('edit-item-availability');
            });


            // Add form submission
            document.getElementById('add-item-form').addEventListener('submit', async function (e) {
                e.preventDefault();

                const itemData = {
                    name: document.getElementById('item-name').value,
                    category: document.getElementById('item-category').value,
                    description: document.getElementById('item-description').value,
                    price: parseFloat(document.getElementById('item-price').value),
                    image: document.getElementById('item-image').value,
                    veg: document.querySelector('input[name="food-type"]:checked').value === 'veg',
                    available: document.getElementById('item-availability').checked,
                    variations: getAddVariationsFromForm()
                };

                const success = await addMenuItem(itemData);
                if (success) {
                    document.getElementById('add-item-modal').style.display = 'none';
                    resetAddForm();
                    alert('Menu item added successfully!');
                }
            });

            // Add item button (both buttons)
            // document.getElementById('add-item-btn').addEventListener('click', function () {
            //     resetAddForm();
            //     document.getElementById('add-item-modal').style.display = 'flex';
            // });

            document.getElementById('add-item-btn-2').addEventListener('click', function () {
                resetAddForm();
                document.getElementById('add-item-modal').style.display = 'flex';
            });
        }

        // Search functionality
        function initializeSearch() {
            const searchInput = document.getElementById('menu-search');

            searchInput.addEventListener('input', function (e) {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    performSearch(this.value.trim());
                }, 300);
            });

            // Clear search when escape is pressed
            searchInput.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    this.value = '';
                    performSearch('');
                }
            });
        }

        function performSearch(searchTerm) {
            const statsElement = document.getElementById('search-stats');
            const resultsCountElement = document.getElementById('results-count');
            const totalItemsElement = document.getElementById('total-items');

            if (!searchTerm) {
                // Show all items when search is empty
                renderMenuTable();
                statsElement.style.display = 'none';
                return;
            }

            const searchResults = searchMenuItems(searchTerm);
            renderSearchResults(searchResults, searchTerm);

            // Update stats
            resultsCountElement.textContent = searchResults.length;
            totalItemsElement.textContent = allMenuItems.length;
            statsElement.style.display = 'block';
        }

        function searchMenuItems(searchTerm) {
            if (!searchTerm) return allMenuItems;

            const searchLower = searchTerm.toLowerCase();
            return allMenuItems.filter(item => {
                // Search in name and category
                const nameMatch = item.name.toLowerCase().includes(searchLower);
                const categoryMatch = item.category.toLowerCase().includes(searchLower);
                const descriptionMatch = item.description && item.description.toLowerCase().includes(searchLower);

                return nameMatch || categoryMatch || descriptionMatch;
            });
        }

        function renderSearchResults(results, searchTerm) {
            const tbody = document.getElementById('menu-table-body');

            if (results.length === 0) {
                tbody.innerHTML = `
            <tr>
                <td colspan="6" class="no-results">
                    <i class="fas fa-search"></i>
                    No menu items found for "${searchTerm}"
                </td>
            </tr>
        `;
                return;
            }

            tbody.innerHTML = '';

            results.forEach(item => {
                const row = document.createElement('tr');
                if (!item.available) {
                    row.classList.add('out-of-stock');
                }

                const basePrice = item.variations && item.variations.length > 0 ?
                    Math.min(...item.variations.map(v => v.price)) : item.price || 0;

                // Highlight search term in results
                const highlightedName = highlightSearchTerm(item.name, searchTerm);
                const highlightedCategory = highlightSearchTerm(item.category, searchTerm);

                row.innerHTML = `
            <td>${highlightedName}</td>
            <td>${highlightedCategory}</td>
            <td>₹${basePrice}</td>
            <td>${item.veg ? 'Veg' : 'Non-Veg'}</td>
            <td>
                <label class="availability-toggle">
                    <div class="toggle-switch">
                        <input type="checkbox" ${item.available ? 'checked' : ''} 
                            onchange="toggleItemAvailability(${item.id}, this.checked)">
                        <span class="toggle-slider"></span>
                    </div>
                    <span>${item.available ? 'Available' : 'Out of Stock'}</span>
                </label>
            </td>
            <td>
                <button class="btn btn-outline" onclick="editMenuItem(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteMenuItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
                tbody.appendChild(row);
            });
        }

        function highlightSearchTerm(text, searchTerm) {
            if (!searchTerm) return text;

            const searchLower = searchTerm.toLowerCase();
            const textLower = text.toLowerCase();
            const index = textLower.indexOf(searchLower);

            if (index === -1) return text;

            const before = text.substring(0, index);
            const match = text.substring(index, index + searchTerm.length);
            const after = text.substring(index + searchTerm.length);

            return `${before}<span class="search-highlight">${match}</span>${after}`;
        }

        // Enhanced Add Item functionality
        function setupAddItemForm() {
            // Add variation button for add form
            document.getElementById('add-variation-btn-add').addEventListener('click', function () {
                const variationsList = document.getElementById('add-variations-list');
                const newIndex = variationsList.children.length;
                const newVariation = createAddVariationElement({ type: '', price: '' }, newIndex);
                variationsList.appendChild(newVariation);
            });

            // Remove variation for add form
            document.getElementById('add-variations-list').addEventListener('click', function (e) {
                if (e.target.closest('.remove-variation')) {
                    const button = e.target.closest('.remove-variation');
                    const variationItem = button.closest('.variation-item');
                    variationItem.remove();
                }
            });

            // Image preview for add form
            document.getElementById('item-image').addEventListener('input', function () {
                updateAddImagePreview(this.value);
            });

            // Availability text update for add form
            document.getElementById('item-availability').addEventListener('change', function () {
                updateAvailabilityText('item-availability');
            });
        }

        function createAddVariationElement(variation, index) {
            const div = document.createElement('div');
            div.className = 'variation-item';
            div.innerHTML = `
        <div class="variation-details">
            <div class="form-group" style="margin-bottom: 0; flex: 1;">
                <input type="text" class="form-control variation-type-add" 
                       value="${variation.type}" 
                       placeholder="Variation type (e.g., half, full)" 
                       data-index="${index}">
            </div>
            <div class="form-group" style="margin-bottom: 0; flex: 1;">
                <input type="number" class="form-control variation-price-add" 
                       value="${variation.price}" 
                       placeholder="Price" min="0" step="0.01"
                       data-index="${index}">
            </div>
        </div>
        <button type="button" class="btn btn-danger remove-variation" data-index="${index}">
            <i class="fas fa-times"></i>
        </button>
    `;
            return div;
        }

        function getAddVariationsFromForm() {
            const variations = [];
            const typeInputs = document.querySelectorAll('.variation-type-add');
            const priceInputs = document.querySelectorAll('.variation-price-add');

            for (let i = 0; i < typeInputs.length; i++) {
                const type = typeInputs[i].value.trim();
                const price = parseFloat(priceInputs[i].value);

                if (type && !isNaN(price)) {
                    variations.push({
                        type: type,
                        price: price
                    });
                }
            }

            return variations;
        }

        function updateAddImagePreview(imageUrl) {
            const preview = document.getElementById('add-image-preview');
            if (imageUrl) {
                preview.innerHTML = `<img src="${imageUrl}" alt="Preview" onerror="this.style.display='none'">`;
            } else {
                preview.innerHTML = '<div class="image-preview-placeholder">Image Preview</div>';
            }
        }

        function resetAddForm() {
            document.getElementById('add-item-form').reset();
            document.getElementById('add-variations-list').innerHTML = '';
            document.getElementById('add-image-preview').innerHTML = '<div class="image-preview-placeholder">Image Preview</div>';

            // Add one default variation
            const defaultVariation = createAddVariationElement({ type: 'standard', price: '' }, 0);
            document.getElementById('add-variations-list').appendChild(defaultVariation);

            // Reset availability text
            updateAvailabilityText('item-availability');
        }



        // Event Listeners
        document.addEventListener('DOMContentLoaded', function () {
            console.log('DOM loaded, setting up event listeners...');
            // Initialize modals first
            setupModalCloseListeners();
            setupMenuEventListeners();
            // Initialize add item form
            setupAddItemForm();

            // Initialize search functionality
            initializeSearch();
            initAdmin();

            // Sales Reports Event Listeners
            const exportReportBtn = document.getElementById('export-report-btn');
            const reportPeriodSelect = document.getElementById('report-period');

            if (reportPeriodSelect) {
                reportPeriodSelect.addEventListener('change', () => {
                    const period = reportPeriodSelect.value;
                    fetchSalesReport(period);
                });
            }

            if (exportReportBtn) {
                exportReportBtn.addEventListener('click', exportReport);
            }

            // Tab Navigation
            if (tabLinks && tabLinks.length > 0) {
                tabLinks.forEach(link => {
                    if (link) {
                        link.addEventListener('click', function (e) {
                            e.preventDefault();

                            tabLinks.forEach(a => {
                                if (a && a.classList) {
                                    a.classList.remove('active');
                                }
                            });

                            if (this && this.classList) {
                                this.classList.add('active');
                            }

                            const tabId = this.getAttribute('data-tab');
                            if (tabId) {
                                tabContents.forEach(tab => {
                                    if (tab && tab.classList) {
                                        tab.classList.remove('active');
                                    }
                                });

                                const targetTab = document.getElementById(tabId);
                                if (targetTab && targetTab.classList) {
                                    targetTab.classList.add('active');
                                }

                                // Load sales report when reports tab is opened
                                if (tabId === 'reports') {
                                    const period = document.getElementById('report-period')?.value || 'today';
                                    fetchSalesReport(period);
                                }
                            }

                            if (window.innerWidth <= 576 && sidebar && sidebar.classList) {
                                sidebar.classList.remove('active');
                            }
                        });
                    }
                });
            }

            // Mobile Menu Toggle
            if (mobileMenuToggle) {
                mobileMenuToggle.addEventListener('click', function () {
                    if (sidebar && sidebar.classList) {
                        sidebar.classList.toggle('active');
                    }
                });
            }

            // Refresh buttons
            const refreshOrdersBtn = document.getElementById('refresh-orders');
            if (refreshOrdersBtn) {
                refreshOrdersBtn.addEventListener('click', () => {
                    console.log('Manual refresh triggered');
                    fetchOrders();
                });
            }


            // Notification close button
            const notificationCloseBtn = document.getElementById('notification-close');
            if (notificationCloseBtn) {
                notificationCloseBtn.addEventListener('click', hideNotification);
            }

            // Header notification click
            const headerNotification = document.getElementById('header-notification');
            if (headerNotification) {
                headerNotification.addEventListener('click', function () {
                    clearNotifications();
                    clearServiceNotifications();
                    const pendingOrders = orders.filter(o => o.status === 'pending').length;
                    const pendingRequests = serviceRequests.filter(r => r.status === 'pending').length;

                    let message = '';
                    if (pendingOrders > 0 && pendingRequests > 0) {
                        message = `You have ${pendingOrders} pending orders and ${pendingRequests} service requests`;
                    } else if (pendingOrders > 0) {
                        message = `You have ${pendingOrders} pending orders`;
                    } else if (pendingRequests > 0) {
                        message = `You have ${pendingRequests} service requests`;
                    } else {
                        message = 'No pending notifications';
                    }

                    alert(message);
                });
            }

            console.log('Event listeners setup complete');
        });
        // Add this to your admin.html script
        document.getElementById('logout-btn').addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = 'admin.login.html';
        });
