require('dotenv').config(); // Add this line

// Add this near the top with other requires
const { 
    generateToken, 
    verifyPassword, 
    authenticateToken,  // Use the existing one from auth.js
    ADMIN_CREDENTIALS 
} = require('./auth');

// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken'); // Add this import
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from all necessary directories
app.use(express.static('public'));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'public/scripts')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));


// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.login.html'));
});

// Handle SPA routing - serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// ===== AUTHENTICATION LOGGING MIDDLEWARE =====

// Log all authentication attempts
app.use('/api/admin/login', (req, res, next) => {
    const { username } = req.body;
    const timestamp = new Date().toISOString();
    const clientIP = req.ip || req.connection.remoteAddress;
    
    console.log(`🔐 AUTH ATTEMPT - Time: ${timestamp} | IP: ${clientIP} | Username: ${username || 'missing'}`);
    next();
});

// Log token verification attempts
app.use('/api/admin/verify', (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;
    const clientIP = req.ip || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();
    
    if (token) {
        console.log(`🔍 TOKEN VERIFY - Time: ${timestamp} | IP: ${clientIP} | Token: ${token.substring(0, 20)}...`);
    } else {
        console.log(`❌ TOKEN MISSING - Time: ${timestamp} | IP: ${clientIP} | No token provided`);
    }
    next();
});

// Log protected route access
app.use((req, res, next) => {
    // Only log for protected admin routes
    if (req.path.startsWith('/api/admin/') && req.path !== '/api/admin/login') {
        const authHeader = req.headers['authorization'];
        const token = authHeader ? authHeader.split(' ')[1] : null;
        const clientIP = req.ip || req.connection.remoteAddress;
        const timestamp = new Date().toISOString();
        const userAgent = req.get('User-Agent') || 'Unknown';
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
                console.log(`✅ PROTECTED ACCESS - Time: ${timestamp} | IP: ${clientIP} | User: ${decoded.username} | Route: ${req.path} | Method: ${req.method}`);
            } catch (error) {
                console.log(`❌ INVALID TOKEN - Time: ${timestamp} | IP: ${clientIP} | Route: ${req.path} | Error: ${error.message}`);
            }
        } else {
            console.log(`🚫 UNAUTHORIZED ACCESS - Time: ${timestamp} | IP: ${clientIP} | Route: ${req.path} | Method: ${req.method} | Agent: ${userAgent.substring(0, 50)}`);
        }
    }
    next();
});

// ===== AUTHENTICATION ROUTES =====

// Admin login with enhanced logging
app.post('/api/admin/login', async (req, res) => {
    const timestamp = new Date().toISOString();
    const clientIP = req.ip || req.connection.remoteAddress;
    
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            console.log(`❌ LOGIN FAILED - Time: ${timestamp} | IP: ${clientIP} | Reason: Missing credentials`);
            return res.status(400).json({ 
                success: false, 
                error: 'Username and password required' 
            });
        }

        console.log(`🔑 LOGIN ATTEMPT - Time: ${timestamp} | IP: ${clientIP} | Username: ${username}`);

        // Check credentials
        if (username !== ADMIN_CREDENTIALS.username) {
            console.log(`❌ LOGIN FAILED - Time: ${timestamp} | IP: ${clientIP} | Username: ${username} | Reason: Invalid username`);
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, ADMIN_CREDENTIALS.password);
        if (!isValidPassword) {
            console.log(`❌ LOGIN FAILED - Time: ${timestamp} | IP: ${clientIP} | Username: ${username} | Reason: Invalid password`);
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }

        // Generate token
        const token = generateToken({ 
            username: username,
            role: 'admin',
            id: 'admin001'
        });

        console.log(`✅ LOGIN SUCCESS - Time: ${timestamp} | IP: ${clientIP} | Username: ${username} | Token: ${token.substring(0, 20)}...`);

        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                username: username,
                role: 'admin'
            }
        });

    } catch (error) {
        console.error(`💥 LOGIN ERROR - Time: ${timestamp} | IP: ${clientIP} | Error: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// Verify token with enhanced logging
app.get('/api/admin/verify', (req, res, next) => {
    const timestamp = new Date().toISOString();
    const clientIP = req.ip || req.connection.remoteAddress;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log(`🚫 NO TOKEN - Time: ${timestamp} | IP: ${clientIP} | Route: /api/admin/verify`);
        return res.status(401).json({ error: 'Access token required' });
    }

    console.log(`🔍 TOKEN VERIFICATION - Time: ${timestamp} | IP: ${clientIP} | Token: ${token.substring(0, 20)}...`);
    
    // Use the authenticateToken middleware
    authenticateToken(req, res, (err) => {
        if (err) {
            console.log(`❌ TOKEN INVALID - Time: ${timestamp} | IP: ${clientIP} | Error: ${err.message}`);
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        
        console.log(`✅ TOKEN VALID - Time: ${timestamp} | IP: ${clientIP} | User: ${req.user.username}`);
        res.json({
            success: true,
            user: req.user
        });
    });
});

// Change password (protected route)
app.post('/api/admin/change-password', authenticateToken, async (req, res) => {
    const timestamp = new Date().toISOString();
    const clientIP = req.ip || req.connection.remoteAddress;
    
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            console.log(`❌ PASSWORD CHANGE FAILED - Time: ${timestamp} | IP: ${clientIP} | User: ${req.user.username} | Reason: Missing passwords`);
            return res.status(400).json({ 
                success: false, 
                error: 'Current and new password required' 
            });
        }

        console.log(`🔑 PASSWORD CHANGE ATTEMPT - Time: ${timestamp} | IP: ${clientIP} | User: ${req.user.username}`);

        // In a real application, you'd update this in your database
        // For now, we'll just return success
        console.log(`✅ PASSWORD CHANGE SUCCESS - Time: ${timestamp} | IP: ${clientIP} | User: ${req.user.username}`);
        
        res.json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error(`💥 PASSWORD CHANGE ERROR - Time: ${timestamp} | IP: ${clientIP} | User: ${req.user.username} | Error: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// ===== PROTECTED ADMIN ROUTES =====

// Log menu modifications
app.use('/api/menu', (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        const clientIP = req.ip || req.connection.remoteAddress;
        const timestamp = new Date().toISOString();
        const authHeader = req.headers['authorization'];
        const token = authHeader ? authHeader.split(' ')[1] : null;
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
                console.log(`📝 MENU ${req.method} - Time: ${timestamp} | IP: ${clientIP} | User: ${decoded.username} | Route: ${req.path}`);
            } catch (error) {
                console.log(`📝 MENU ${req.method} ATTEMPT - Time: ${timestamp} | IP: ${clientIP} | Route: ${req.path} | Status: Unauthorized`);
            }
        }
    }
    next();
});

// Log order modifications
app.use('/api/orders', (req, res, next) => {
    if (req.method === 'DELETE') {
        const clientIP = req.ip || req.connection.remoteAddress;
        const timestamp = new Date().toISOString();
        const authHeader = req.headers['authorization'];
        const token = authHeader ? authHeader.split(' ')[1] : null;
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
                console.log(`🗑️ ORDER DELETE - Time: ${timestamp} | IP: ${clientIP} | User: ${decoded.username} | Order ID: ${req.params.id}`);
            } catch (error) {
                console.log(`🗑️ ORDER DELETE ATTEMPT - Time: ${timestamp} | IP: ${clientIP} | Order ID: ${req.params.id} | Status: Unauthorized`);
            }
        }
    }
    next();
});

// Protect all admin routes (using the existing authenticateToken from auth.js)
app.use('/api/admin/dashboard', authenticateToken);
app.use('/api/admin/sales-report', authenticateToken);
app.use('/api/admin/chart-data', authenticateToken);

// Also protect menu modification routes
app.use('/api/menu', (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        authenticateToken(req, res, next);
    } else {
        next(); // GET requests don't need auth
    }
});

// Protect orders modification routes
app.use('/api/orders', (req, res, next) => {
    if (req.method === 'DELETE') {
        authenticateToken(req, res, next);
    } else {
        next();
    }
});

// Data file path
const DATA_FILE = './data/restaurantData.json';

// Initialize or load database
function initializeDatabase() {
    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
    }
    
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            menuItems: require('./data/menuItems.json'),
            orders: [],
            serviceRequests: [],
            reviews: [],
            adminSettings: {
                restaurantName: "Maher Chinese",
                tables: 20,
                orderCounter: 0
            }
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

let database = initializeDatabase();

// Save database to file
function saveDatabase() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(database, null, 2));
}

// Generate order ID in format: date-month-number (16-11-001)
function generateOrderId() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    // Check if we need to reset counter for new day
    const today = `${day}-${month}`;
    const lastOrder = database.orders[database.orders.length - 1];
    
    if (lastOrder) {
        const lastOrderDate = lastOrder.id.split('-').slice(0, 2).join('-');
        if (lastOrderDate !== today) {
            database.adminSettings.orderCounter = 0;
        }
    }
    
    // Increment order counter for the day
    database.adminSettings.orderCounter++;
    const orderNumber = String(database.adminSettings.orderCounter).padStart(3, '0');
    
    saveDatabase();
    return `${day}-${month}-${orderNumber}`;
}

// Calculate average rating
function calculateAverageRating() {
    if (database.reviews.length === 0) return 0;
    
    const totalRating = database.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / database.reviews.length).toFixed(1);
}

// API Routes

// Menu Routes
app.get('/api/menu', (req, res) => {
    console.log(`📋 MENU FETCH - Time: ${new Date().toISOString()} | IP: ${req.ip} | Items: ${database.menuItems.length}`);
    res.json(database.menuItems);
});

app.put('/api/menu/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedItem = req.body;
    const index = database.menuItems.findIndex(item => item.id === id);
    
    if (index !== -1) {
        database.menuItems[index] = { ...database.menuItems[index], ...updatedItem };
        saveDatabase();
        console.log(`✏️ MENU UPDATE - Time: ${new Date().toISOString()} | IP: ${req.ip} | Item ID: ${id} | Name: ${updatedItem.name}`);
        res.json(database.menuItems[index]);
    } else {
        console.log(`❌ MENU UPDATE FAILED - Time: ${new Date().toISOString()} | IP: ${req.ip} | Item ID: ${id} | Reason: Not found`);
        res.status(404).json({ error: 'Item not found' });
    }
});

app.post('/api/menu', (req, res) => {
    const newItem = {
        id: Date.now(),
        ...req.body
    };
    database.menuItems.push(newItem);
    saveDatabase();
    console.log(`➕ MENU ITEM ADDED - Time: ${new Date().toISOString()} | IP: ${req.ip} | Item: ${newItem.name} | Category: ${newItem.category}`);
    res.json(newItem);
});

// Delete menu item
app.delete('/api/menu/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = database.menuItems.findIndex(item => item.id === id);
    
    if (index !== -1) {
        const deletedItem = database.menuItems.splice(index, 1)[0];
        saveDatabase();
        
        console.log(`🗑️ MENU ITEM DELETED - Time: ${new Date().toISOString()} | IP: ${req.ip} | Item ID: ${deletedItem.id} | Name: ${deletedItem.name} | Category: ${deletedItem.category}`);
        
        res.json({ 
            success: true, 
            message: 'Menu item deleted successfully',
            deletedItem: deletedItem
        });
    } else {
        console.log(`❌ MENU DELETE FAILED - Time: ${new Date().toISOString()} | IP: ${req.ip} | Item ID: ${id} | Reason: Not found`);
        res.status(404).json({ 
            success: false, 
            error: 'Menu item not found' 
        });
    }
});

// Update menu item (complete update)
app.put('/api/menu/:id/update', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;
    const index = database.menuItems.findIndex(item => item.id === id);
    
    if (index !== -1) {
        // Preserve the ID and merge with updated data
        database.menuItems[index] = { 
            ...database.menuItems[index], 
            ...updatedData,
            id: id // Ensure ID doesn't change
        };
        saveDatabase();
        
        console.log(`✏️ MENU ITEM UPDATED - Time: ${new Date().toISOString()} | IP: ${req.ip} | Item ID: ${id} | Name: ${database.menuItems[index].name} | Category: ${database.menuItems[index].category} | Price: ${database.menuItems[index].price}`);
        
        res.json({
            success: true,
            message: 'Menu item updated successfully',
            updatedItem: database.menuItems[index]
        });
    } else {
        console.log(`❌ MENU UPDATE FAILED - Time: ${new Date().toISOString()} | IP: ${req.ip} | Item ID: ${id} | Reason: Not found`);
        res.status(404).json({ 
            success: false, 
            error: 'Menu item not found' 
        });
    }
});

// Orders Routes
app.post('/api/orders', (req, res) => {
    const order = {
        id: generateOrderId(),
        ...req.body,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Ensure items structure is proper
    if (!order.items || typeof order.items !== 'object') {
        order.items = {};
    }
    
    database.orders.push(order);
    saveDatabase();
    
    console.log(`🆕 NEW ORDER CREATED - Time: ${new Date().toISOString()} | IP: ${req.ip} | Order ID: ${order.id} | Table: ${order.table} | Total Items: ${Object.keys(order.items).length} | Total Amount: ₹${order.total}`);
    
    res.json(order);
});

// Add this DELETE route for orders in server.js
app.delete('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const orderIndex = database.orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        const deletedOrder = database.orders.splice(orderIndex, 1)[0];
        saveDatabase();
        
        console.log(`🗑️ ORDER DELETED - Time: ${new Date().toISOString()} | IP: ${req.ip} | Order ID: ${deletedOrder.id} | Table: ${deletedOrder.table} | Amount: ₹${deletedOrder.total}`);
        
        res.json({ 
            success: true, 
            message: 'Order deleted successfully',
            deletedOrder: deletedOrder
        });
    } else {
        console.log(`❌ ORDER DELETE FAILED - Time: ${new Date().toISOString()} | IP: ${req.ip} | Order ID: ${orderId} | Reason: Not found`);
        res.status(404).json({ 
            success: false, 
            error: 'Order not found' 
        });
    }
});

// Update the orders GET route to return all orders
app.get('/api/orders', (req, res) => {
    console.log(`📦 ORDERS FETCH - Time: ${new Date().toISOString()} | IP: ${req.ip} | Total Orders: ${database.orders.length}`);
    // Return orders sorted by creation date (newest first)
    const sortedOrders = [...database.orders].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(sortedOrders);
});

app.put('/api/orders/:id/status', (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    const order = database.orders.find(o => o.id === orderId);
    
    if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
        saveDatabase();
        console.log(`🔄 ORDER STATUS UPDATED - Time: ${new Date().toISOString()} | IP: ${req.ip} | Order ID: ${orderId} | Status: ${status}`);
        res.json(order);
    } else {
        console.log(`❌ ORDER STATUS UPDATE FAILED - Time: ${new Date().toISOString()} | IP: ${req.ip} | Order ID: ${orderId} | Reason: Not found`);
        res.status(404).json({ error: 'Order not found' });
    }
});

// Service Requests Routes
app.get('/api/service-requests', (req, res) => {
    console.log(`🔔 SERVICE REQUESTS FETCH - Time: ${new Date().toISOString()} | IP: ${req.ip} | Total Requests: ${database.serviceRequests.length}`);
    res.json(database.serviceRequests);
});

app.post('/api/service-requests', (req, res) => {
    const request = {
        id: 'SR-' + Date.now(),
        ...req.body,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    database.serviceRequests.push(request);
    saveDatabase();
    
    console.log(`🆕 SERVICE REQUEST CREATED - Time: ${new Date().toISOString()} | IP: ${req.ip} | Request ID: ${request.id} | Table: ${request.table} | Type: ${request.type}`);
    
    res.json(request);
});

app.put('/api/service-requests/:id/resolve', (req, res) => {
    const requestId = req.params.id;
    const request = database.serviceRequests.find(sr => sr.id === requestId);
    
    if (request) {
        request.status = 'resolved';
        request.resolvedAt = new Date().toISOString();
        saveDatabase();
        console.log(`✅ SERVICE REQUEST RESOLVED - Time: ${new Date().toISOString()} | IP: ${req.ip} | Request ID: ${requestId} | Table: ${request.table}`);
        res.json(request);
    } else {
        console.log(`❌ SERVICE REQUEST RESOLVE FAILED - Time: ${new Date().toISOString()} | IP: ${req.ip} | Request ID: ${requestId} | Reason: Not found`);
        res.status(404).json({ error: 'Service request not found' });
    }
});

// Reviews Routes
app.get('/api/reviews', (req, res) => {
    console.log(`⭐ REVIEWS FETCH - Time: ${new Date().toISOString()} | IP: ${req.ip} | Total Reviews: ${database.reviews.length}`);
    res.json(database.reviews);
});

app.post('/api/reviews', (req, res) => {
    const review = {
        id: 'REV-' + Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    database.reviews.push(review);
    saveDatabase();
    console.log(`⭐ NEW REVIEW - Time: ${new Date().toISOString()} | IP: ${req.ip} | Table: ${review.table} | Rating: ${review.rating}/5`);
    res.json(review);
});

// Admin Dashboard Data
app.get('/api/admin/dashboard', (req, res) => {
    const today = new Date().toDateString();
    const todayOrders = database.orders.filter(order => 
        new Date(order.createdAt).toDateString() === today
    );
    
    const avgRating = calculateAverageRating();
    
    const dashboardData = {
        todayOrders: todayOrders.length,
        todaySales: todayOrders.reduce((sum, order) => sum + order.total, 0),
        activeTables: new Set(todayOrders.map(order => order.table)).size,
        pendingOrders: database.orders.filter(order => order.status === 'pending').length,
        activeServiceRequests: database.serviceRequests.filter(sr => sr.status === 'pending').length,
        averageRating: avgRating,
        totalReviews: database.reviews.length
    };
    
    console.log(`📊 DASHBOARD FETCH - Time: ${new Date().toISOString()} | IP: ${req.ip} | Today Orders: ${dashboardData.todayOrders} | Today Sales: ₹${dashboardData.todaySales}`);
    
    res.json(dashboardData);
});

// Enhanced Sales Reports API
app.get('/api/admin/sales-report', (req, res) => {
    const { period } = req.query;
    
    let startDate, endDate;
    const now = new Date();
    
    // Calculate date range based on period
    switch (period) {
        case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            break;
        case 'yesterday':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            break;
        case 'last-month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        default:
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    }
    
    // Filter orders by date range
    const periodOrders = database.orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate < endDate;
    });
    
    // Calculate report data
    const totalOrders = periodOrders.length;
    const totalSales = periodOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    // Calculate popular items
    const itemSales = {};
    periodOrders.forEach(order => {
        for (const itemId in order.items) {
            const itemData = order.items[itemId];
            const menuItem = database.menuItems.find(item => item.id === parseInt(itemId));
            
            if (menuItem && itemData.variations) {
                for (const variationType in itemData.variations) {
                    const quantity = itemData.variations[variationType];
                    if (quantity > 0) {
                        const variation = menuItem.variations.find(v => v.type === variationType);
                        const price = variation ? variation.price : 0;
                        const itemTotal = price * quantity;
                        
                        if (!itemSales[itemId]) {
                            itemSales[itemId] = {
                                name: menuItem.name,
                                category: menuItem.category,
                                orders: 0,
                                revenue: 0
                            };
                        }
                        
                        itemSales[itemId].orders += quantity;
                        itemSales[itemId].revenue += itemTotal;
                    }
                }
            }
        }
    });
    
    // Convert to array and sort by revenue
    const popularItems = Object.values(itemSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);
    
    console.log(`📈 SALES REPORT - Time: ${new Date().toISOString()} | IP: ${req.ip} | Period: ${period} | Orders: ${totalOrders} | Sales: ₹${totalSales}`);
    
    res.json({
        period,
        totalOrders,
        totalSales,
        avgOrderValue,
        popularItems,
        dateRange: {
            start: startDate.toISOString(),
            end: endDate.toISOString()
        }
    });
});

// Chart Data API
app.get('/api/admin/chart-data', (req, res) => {
    const { period = 'week', type = 'sales' } = req.query;
    
    const now = new Date();
    let days = 7; // Default to week
    
    switch (period) {
        case 'today':
            days = 1;
            break;
        case 'yesterday':
            days = 1;
            break;
        case 'week':
            days = 7;
            break;
        case 'month':
            days = 30;
            break;
        case 'last-month':
            days = 30;
            break;
    }
    
    // Generate date labels
    const labels = [];
    const salesData = [];
    const ordersData = [];
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        if (period === 'today') {
            labels.push(`${date.getHours()}:00`);
        } else if (period === 'yesterday') {
            const yesterday = new Date(date);
            yesterday.setDate(yesterday.getDate() - 1);
            labels.push(`${yesterday.getHours()}:00`);
        } else {
            labels.push(date.toLocaleDateString('en-IN', { 
                month: 'short', 
                day: 'numeric' 
            }));
        }
        
        // Filter orders for this time period
        let periodOrders = [];
        if (period === 'today' || period === 'yesterday') {
            // Hourly data for today/yesterday
            const startHour = new Date(date);
            startHour.setHours(date.getHours(), 0, 0, 0);
            const endHour = new Date(date);
            endHour.setHours(date.getHours() + 1, 0, 0, 0);
            
            if (period === 'yesterday') {
                startHour.setDate(startHour.getDate() - 1);
                endHour.setDate(endHour.getDate() - 1);
            }
            
            periodOrders = database.orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= startHour && orderDate < endHour;
            });
        } else {
            // Daily data for week/month
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            
            periodOrders = database.orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= startDate && orderDate < endDate;
            });
        }
        
        const sales = periodOrders.reduce((sum, order) => sum + order.total, 0);
        const orders = periodOrders.length;
        
        salesData.push(sales);
        ordersData.push(orders);
    }
    
    console.log(`📊 CHART DATA - Time: ${new Date().toISOString()} | IP: ${req.ip} | Period: ${period} | Type: ${type}`);
    
    res.json({
        labels,
        sales: salesData,
        orders: ordersData,
        period,
        type
    });
});

// Railway-compatible server configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    console.log(`📝 Authentication logging enabled`);
    console.log(`🔐 Admin login available at: /admin-login`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

