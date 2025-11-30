// API Base URL - Update this to your backend URL
        const API_BASE = 'http://localhost:3000/api';
        // const API_BASE = 'http://192.168.0.109:3000/api';

        // Menu data with variations (fallback data)
        const fallbackMenuItems = [
            {
                "id": 1,
                "name": "Munchurian Dry",
                "description": "Oil fried crispy cabbage munchurian",
                "category": "starters",
                "veg": true,
                "image": "/images/dry_munchurian.png",
                "variations": [
                    {
                        "type": "half",
                        "price": 80
                    },
                    {
                        "type": "full",
                        "price": 150
                    }
                ],
                "available": true
            },
            {
                "id": 2,
                "name": "Munchurian Gravy",
                "description": "oil fried crispy cabbage munchurian with tasty gravy",
                "category": "starters",
                "veg": true,
                "image": "images/gravy_munchurian.png",
                "variations": [
                    {
                        "type": "half",
                        "price": 90
                    },
                    {
                        "type": "full",
                        "price": 170
                    }
                ],
                "available": true
            },
            {
                "id": 3,
                "name": "Paneer 65",
                "description": "Spicy deep-fried cottage cheese cubes with southern flavors",
                "category": "starters",
                "veg": true,
                "image": "images/paneer 65.png",
                "variations": [
                    {
                        "type": "half",
                        "price": 90
                    },
                    {
                        "type": "full",
                        "price": 170
                    }
                ],
                "available": true
            },
            {
                "id": 4,
                "name": "Veg Crispy",
                "description": "Crispy fried vegetables tossed in tangy seasoning",
                "category": "starters",
                "veg": true,
                "image": "images/veg crispy.png",
                "variations": [
                    {
                        "type": "half",
                        "price": 120
                    },
                    {
                        "type": "full",
                        "price": 220
                    }
                ],
                "available": true
            },
            {
                "id": 5,
                "name": "Paneer Crispy",
                "description": "Crispy cottage cheese coated with spices and fried",
                "category": "starters",
                "veg": true,
                "image": "images/panner crispy.png",
                "variations": [
                    {
                        "type": "half",
                        "price": 110
                    },
                    {
                        "type": "full",
                        "price": 200
                    }
                ],
                "available": true
            },
            {
                "id": 6,
                "name": "Chinese Bhel",
                "description": "Crispy noodles tossed with tangy Indo-Chinese sauces and fresh veggies.",
                "category": "starters",
                "veg": true,
                "image": "images/chinese bhel.png",
                "variations": [
                    {
                        "type": "half",
                        "price": 60
                    },
                    {
                        "type": "full",
                        "price": 140
                    }
                ],
                "available": true
            },
            {
                "id": 7,
                "name": "Paneer Chinese Bhel",
                "description": "Crispy noodles mixed with saucy vegetables and soft paneer cubes for a flavorful twist.",
                "category": "starters",
                "veg": true,
                "image": "images/Paneer Chinese Bhel.png",
                "variations": [
                    {
                        "type": "half",
                        "price": 90
                    },
                    {
                        "type": "full",
                        "price": 160
                    }
                ],
                "available": true
            },
            {
                "id": 8,
                "name": "Veg Manchow Soup",
                "description": "Hot & spicy soup topped with crispy noodles",
                "category": "soup",
                "veg": true,
                "image": "images/veg munchaw soup.png",
                "variations": [
                    {
                        "type": "half",
                        "price": 50
                    },
                    {
                        "type": "full",
                        "price": 90
                    }
                ],
                "available": true
            },
            {
                "id": 9,
                "name": "Lung Fung Soup",
                "description": "Thick Indo-Chinese soup with vegetables",
                "category": "soup",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 60
                    },
                    {
                        "type": "full",
                        "price": 100
                    }
                ],
                "available": true
            },
            {
                "id": 10,
                "name": "Baba Special Soup",
                "description": "House special hearty vegetable soup",
                "category": "soup",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 70
                    },
                    {
                        "type": "full",
                        "price": 120
                    }
                ],
                "available": true
            },
            {
                "id": 11,
                "name": "Masaledar Hot & Sour Soup",
                "description": "Hot and sour soup with a spicy twist",
                "category": "soup",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 80
                    },
                    {
                        "type": "full",
                        "price": 150
                    }
                ],
                "available": true
            },
            {
                "id": 12,
                "name": "Fried Rice",
                "description": "Classic Indo-Chinese fried rice with mixed vegetables",
                "category": "rice",
                "veg": true,
                "image": "images/fried rice.png",
                "variations": [
                    {
                        "type": "half",
                        "price": 70
                    },
                    {
                        "type": "full",
                        "price": 130
                    }
                ],
                "available": true
            },
            {
                "id": 13,
                "name": "Paneer Fried Rice",
                "description": "Fried rice tossed with seasoned paneer cubes",
                "category": "rice",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 90
                    },
                    {
                        "type": "full",
                        "price": 150
                    }
                ],
                "available": true
            },
            {
                "id": 14,
                "name": "Schezwan Rice",
                "description": "Spicy rice cooked in rich Schezwan sauce",
                "category": "rice",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 80
                    },
                    {
                        "type": "full",
                        "price": 140
                    }
                ],
                "available": true
            },
            {
                "id": 15,
                "name": "Paneer Schezwan Rice",
                "description": "Schezwan rice mixed with soft paneer cubes",
                "category": "rice",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 100
                    },
                    {
                        "type": "full",
                        "price": 170
                    }
                ],
                "available": true
            },
            {
                "id": 16,
                "name": "Singapore Rice",
                "description": "Singapore-style flavorful spicy rice",
                "category": "rice",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 90
                    },
                    {
                        "type": "full",
                        "price": 160
                    }
                ],
                "available": true
            },
            {
                "id": 17,
                "name": "Combo Rice",
                "description": "Combination rice served with gravy and noodles",
                "category": "rice",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 100
                    },
                    {
                        "type": "full",
                        "price": 170
                    }
                ],
                "available": true
            },
            {
                "id": 18,
                "name": "Triple Rice",
                "description": "Rice served with noodles and Manchurian gravy — a full triple combo",
                "category": "rice",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 120
                    },
                    {
                        "type": "full",
                        "price": 200
                    }
                ],
                "available": true
            },
            {
                "id": 19,
                "name": "Chopper Rice",
                "description": "Fiery Indo-Chinese chopper-style rice",
                "category": "rice",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 120
                    },
                    {
                        "type": "full",
                        "price": 200
                    }
                ],
                "available": true
            },
            {
                "id": 20,
                "name": "Chilli Rice",
                "description": "Rice tossed with hot chilli sauce and veggies",
                "category": "rice",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 130
                    },
                    {
                        "type": "full",
                        "price": 200
                    }
                ],
                "available": true
            },
            {
                "id": 21,
                "name": "Thousand Rice",
                "description": "Rich thousand-style Indo-Chinese rice",
                "category": "rice",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 130
                    },
                    {
                        "type": "full",
                        "price": 210
                    }
                ],
                "available": true
            },
            {
                "id": 22,
                "name": "Sherfa Rice",
                "description": "Special sherfa-flavored spicy rice",
                "category": "rice",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 140
                    },
                    {
                        "type": "full",
                        "price": 220
                    }
                ],
                "available": true
            },
            {
                "id": 23,
                "name": "Malaysian Rice",
                "description": "Aromatic Malaysian-style rice with bold spices",
                "category": "rice",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 150
                    },
                    {
                        "type": "full",
                        "price": 250
                    }
                ],
                "available": true
            },
            {
                "id": 24,
                "name": "Hakka Noodles",
                "description": "Classic Indo-Chinese stir-fried noodles with vegetables",
                "category": "noodles",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 70
                    },
                    {
                        "type": "full",
                        "price": 130
                    }
                ],
                "available": true
            },
            {
                "id": 25,
                "name": "Paneer Hakka Noodles",
                "description": "Hakka noodles tossed with soft paneer cubes",
                "category": "noodles",
                "veg": true,
                "image": "images/paneer noodles.png",
                "variations": [
                    {
                        "type": "half",
                        "price": 100
                    },
                    {
                        "type": "full",
                        "price": 180
                    }
                ],
                "available": true
            },
            {
                "id": 26,
                "name": "Schezwan Noodles",
                "description": "Hot and spicy noodles with Schezwan flavors",
                "category": "noodles",
                "veg": true,
                "image": "images/schezwan noodles.png",
                "variations": [
                    {
                        "type": "half",
                        "price": 80
                    },
                    {
                        "type": "full",
                        "price": 150
                    }
                ],
                "available": true
            },
            {
                "id": 27,
                "name": "Paneer Schezwan Noodles",
                "description": "Schezwan noodles served with soft paneer cubes",
                "category": "noodles",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 100
                    },
                    {
                        "type": "full",
                        "price": 180
                    }
                ],
                "available": true
            },
            {
                "id": 28,
                "name": "Singapore Noodles",
                "description": "Singaporean style spicy noodles",
                "category": "noodles",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 90
                    },
                    {
                        "type": "full",
                        "price": 170
                    }
                ],
                "available": true
            },
            {
                "id": 29,
                "name": "Schezwan Triple Noodles",
                "description": "Triple noodles served with Schezwan base",
                "category": "noodles",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 120
                    },
                    {
                        "type": "full",
                        "price": 200
                    }
                ],
                "available": true
            },
            {
                "id": 30,
                "name": "Chopper Noodles",
                "description": "Noodles cooked in chopper style seasoning",
                "category": "noodles",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 120
                    },
                    {
                        "type": "full",
                        "price": 200
                    }
                ],
                "available": true
            },
            {
                "id": 31,
                "name": "Chilli Noodles",
                "description": "Noodles tossed in hot chilli sauce",
                "category": "noodles",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 120
                    },
                    {
                        "type": "full",
                        "price": 200
                    }
                ],
                "available": true
            },
            {
                "id": 32,
                "name": "Thousand Noodles",
                "description": "Thousand-style spicy noodles",
                "category": "noodles",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 130
                    },
                    {
                        "type": "full",
                        "price": 220
                    }
                ],
                "available": true
            },
            {
                "id": 33,
                "name": "Sherfa Noodles",
                "description": "Special sherfa-style noodles",
                "category": "noodles",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 130
                    },
                    {
                        "type": "full",
                        "price": 220
                    }
                ],
                "available": true
            },
            {
                "id": 34,
                "name": "Malaysian Noodles",
                "description": "Authentic Malaysian flavor noodles",
                "category": "noodles",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 150
                    },
                    {
                        "type": "full",
                        "price": 280
                    }
                ]
            },
            {
                "id": 40,
                "name": "Maher Special",
                "description": "House special signature preparation",
                "category": "chef-special",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "full",
                        "price": 400
                    }
                ]
            },
            {
                "id": 41,
                "name": "Dragon Rice",
                "description": "Fiery spicy dragon-style rice",
                "category": "chef-special",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "full",
                        "price": 250
                    }
                ],
                "available": true
            },
            {
                "id": 42,
                "name": "Schezwan Chopsy",
                "description": "Crispy chopsy tossed in spicy Schezwan sauce",
                "category": "chopsy",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 130
                    },
                    {
                        "type": "full",
                        "price": 210
                    }
                ],
                "available": true
            },
            {
                "id": 43,
                "name": "American Chopsy",
                "description": "Crispy noodles topped with sweet & tangy sauce",
                "category": "chopsy",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 140
                    },
                    {
                        "type": "full",
                        "price": 220
                    }
                ],
                "available": true
            },
            {
                "id": 44,
                "name": "Campa Cola",
                "description": "Refreshing cola drink",
                "category": "soft-drinks",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "bottle",
                        "price": 40
                    }
                ],
                "available": true
            },
            {
                "id": 45,
                "name": "Thums Up",
                "description": "Strong and bold cola",
                "category": "soft-drinks",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "bottle",
                        "price": 45
                    }
                ],
                "available": true
            },
            {
                "id": 46,
                "name": "Sprite",
                "description": "Lemon-lime sparkling drink",
                "category": "soft-drinks",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "bottle",
                        "price": 40
                    }
                ],
                "available": true
            },
            {
                "id": 47,
                "name": "Fanta",
                "description": "Orange flavored soft drink",
                "category": "soft-drinks",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "bottle",
                        "price": 40
                    }
                ],
                "available": true
            },
            {
                "id": 49,
                "name": "Maaza",
                "description": "Mango fruit drink",
                "category": "soft-drinks",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "bottle",
                        "price": 50
                    }
                ],
                "available": true
            },
            {
                "id": 50,
                "name": "Omlette",
                "description": "Freshly prepared egg omlette",
                "category": "extras",
                "veg": false,
                "image": "images/omalatee.jpg",
                "variations": [
                    {
                        "type": "standard",
                        "price": 20
                    }
                ],
                "available": true
            },
            {
                "id": 51,
                "name": "Timepass",
                "description": "Special timepass snack",
                "category": "extras",
                "veg": true,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "standard",
                        "price": 20
                    }
                ],
                "available": true
            },
            {
                "id": 52,
                "name": "Chicken 65",
                "description": "Spicy deep-fried chicken tossed in South Indian-style seasoning",
                "category": "starters",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 90
                    },
                    {
                        "type": "full",
                        "price": 170
                    }
                ],
                "available": true
            },
            {
                "id": 53,
                "name": "Chicken Crispy",
                "description": "Crispy fried chicken tossed in tangy Indo-Chinese sauces",
                "category": "starters",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 90
                    },
                    {
                        "type": "full",
                        "price": 170
                    }
                ],
                "available": true
            },
            {
                "id": 54,
                "name": "Lollipop (Dry)",
                "description": "Crispy chicken lollipops served dry with seasoning",
                "category": "starters",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 90
                    },
                    {
                        "type": "full",
                        "price": 170
                    }
                ],
                "available": true
            },
            {
                "id": 55,
                "name": "Chicken Chilli (Dry)",
                "description": "Stir-fried chicken with capsicum and spicy chilli sauce",
                "category": "starters",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 90
                    },
                    {
                        "type": "full",
                        "price": 170
                    }
                ],
                "available": true
            },
            {
                "id": 56,
                "name": "Masala Lollipop",
                "description": "Spicy masala-coated chicken lollipops",
                "category": "starters",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 120
                    },
                    {
                        "type": "full",
                        "price": 220
                    }
                ],
                "available": true
            },
            {
                "id": 57,
                "name": "Chicken Chilli Gravy",
                "description": "Chicken cooked in rich, spicy chilli gravy",
                "category": "starters",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 110
                    },
                    {
                        "type": "full",
                        "price": 200
                    }
                ],
                "available": true
            },
            {
                "id": 58,
                "name": "Chicken Chinese Bhel",
                "description": "Crispy noodle bhel mixed with chicken and Indo-Chinese sauces",
                "category": "starters",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 80
                    },
                    {
                        "type": "full",
                        "price": 150
                    }
                ],
                "available": true
            },
            {
                "id": 59,
                "name": "Chicken Fried Rice",
                "description": "Classic fried rice cooked with shredded chicken and vegetables",
                "category": "rice",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 70
                    },
                    {
                        "type": "full",
                        "price": 130
                    }
                ],
                "available": true
            },
            {
                "id": 60,
                "name": "Chicken Schezwan Rice",
                "description": "Spicy Schezwan-style rice tossed with chicken",
                "category": "rice",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 80
                    },
                    {
                        "type": "full",
                        "price": 140
                    }
                ],
                "available": true
            },
            {
                "id": 61,
                "name": "Chicken Singapore Rice",
                "description": "Singapore-style flavoured rice with shredded chicken",
                "category": "rice",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 90
                    },
                    {
                        "type": "full",
                        "price": 160
                    }
                ],
                "available": true
            },
            {
                "id": 62,
                "name": "Chicken Combo Rice",
                "description": "Combination-style rice served with chicken gravy",
                "category": "rice",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 90
                    },
                    {
                        "type": "full",
                        "price": 170
                    }
                ],
                "available": true
            },
            {
                "id": 63,
                "name": "Chicken Triple Rice",
                "description": "Triple-style rice with noodles and chicken Manchurian gravy",
                "category": "rice",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 120
                    },
                    {
                        "type": "full",
                        "price": 200
                    }
                ],
                "available": true
            },
            {
                "id": 64,
                "name": "Chicken Chopper Rice",
                "description": "Fiery chopper-style rice with chicken",
                "category": "rice",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 120
                    },
                    {
                        "type": "full",
                        "price": 200
                    }
                ],
                "available": true
            },
            {
                "id": 65,
                "name": "Chicken Chilli Rice",
                "description": "Rice tossed with spicy chilli sauce and shredded chicken",
                "category": "rice",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 120
                    },
                    {
                        "type": "full",
                        "price": 200
                    }
                ],
                "available": true
            },
            {
                "id": 66,
                "name": "Chicken Thousand Rice",
                "description": "Thousand-style Indo-Chinese chicken rice",
                "category": "rice",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 130
                    },
                    {
                        "type": "full",
                        "price": 210
                    }
                ],
                "available": true
            },
            {
                "id": 67,
                "name": "Chicken Sherfa Rice",
                "description": "Special sherfa-flavoured spicy chicken rice",
                "category": "rice",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 130
                    },
                    {
                        "type": "full",
                        "price": 220
                    }
                ],
                "available": true
            },
            {
                "id": 68,
                "name": "Chicken Malaysian Rice",
                "description": "Rich Malaysian-style seasoned rice with chicken",
                "category": "rice",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 150
                    },
                    {
                        "type": "full",
                        "price": 250
                    }
                ],
                "available": true
            },
            {
                "id": 69,
                "name": "Chicken Hakka Noodles",
                "description": "Classic Hakka-style stir-fried noodles with shredded chicken",
                "category": "noodles",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 70
                    },
                    {
                        "type": "full",
                        "price": 130
                    }
                ],
                "available": true
            },
            {
                "id": 70,
                "name": "Chicken Schezwan Noodles",
                "description": "Hot and spicy Schezwan-style noodles with chicken",
                "category": "noodles",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 80
                    },
                    {
                        "type": "full",
                        "price": 150
                    }
                ],
                "available": true
            },
            {
                "id": 71,
                "name": "Chicken Singapore Noodles",
                "description": "Singapore-style flavored noodles with shredded chicken",
                "category": "noodles",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 90
                    },
                    {
                        "type": "full",
                        "price": 170
                    }
                ],
                "available": true
            },
            {
                "id": 72,
                "name": "Schezwan Triple Noodles",
                "description": "Triple-style noodles served with Schezwan gravy and chicken",
                "category": "noodles",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 120
                    },
                    {
                        "type": "full",
                        "price": 200
                    }
                ],
                "available": true
            },
            {
                "id": 73,
                "name": "Chicken Chopper Noodles",
                "description": "Spicy chopper-style noodles with chicken",
                "category": "noodles",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 120
                    },
                    {
                        "type": "full",
                        "price": 200
                    }
                ],
                "available": true
            },
            {
                "id": 74,
                "name": "Chicken Chilli Noodles",
                "description": "Noodles tossed in spicy chilli sauce with chicken",
                "category": "noodles",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 120
                    },
                    {
                        "type": "full",
                        "price": 200
                    }
                ],
                "available": true
            },
            {
                "id": 75,
                "name": "Chicken Thousand Noodles",
                "description": "Thousand-style noodles cooked with chicken",
                "category": "noodles",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 130
                    },
                    {
                        "type": "full",
                        "price": 220
                    }
                ],
                "available": true
            },
            {
                "id": 76,
                "name": "Chicken Sherfa Noodles",
                "description": "Special sherfa-flavored noodles with chicken",
                "category": "noodles",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 130
                    },
                    {
                        "type": "full",
                        "price": 220
                    }
                ],
                "available": true
            },
            {
                "id": 77,
                "name": "Chicken Malaysian Noodles",
                "description": "Aromatic Malaysian-style noodles with spicy chicken",
                "category": "noodles",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 150
                    },
                    {
                        "type": "full",
                        "price": 280
                    }
                ],
                "available": true
            },
            {
                "id": 78,
                "name": "Chicken Manchow Soup",
                "description": "Hot and spicy chicken soup topped with crispy noodles",
                "category": "soup",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 50
                    },
                    {
                        "type": "full",
                        "price": 90
                    }
                ],
                "available": true
            },
            {
                "id": 79,
                "name": "Lung Fung Soup (Chicken)",
                "description": "Thick creamy soup with chicken and vegetables",
                "category": "soup",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 60
                    },
                    {
                        "type": "full",
                        "price": 100
                    }
                ],
                "available": true
            },
            {
                "id": 80,
                "name": "Chicken Special Soup",
                "description": "House special rich chicken soup",
                "category": "soup",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 70
                    },
                    {
                        "type": "full",
                        "price": 120
                    }
                ],
                "available": true
            },
            {
                "id": 81,
                "name": "Hot and Sour Chicken Soup",
                "description": "Classic hot and sour soup with chicken",
                "category": "soup",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 80
                    },
                    {
                        "type": "full",
                        "price": 150
                    }
                ],
                "available": true
            },
            {
                "id": 82,
                "name": "Maher Special Dragon Rice (Chicken)",
                "description": "Maher restaurant’s special spicy dragon-style chicken rice",
                "category": "chef-special",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "full",
                        "price": 250
                    }
                ],
                "available": true
            },
            {
                "id": 83,
                "name": "Maher Special (Chicken)",
                "description": "Signature rich chicken dish prepared in Maher special style",
                "category": "chef-special",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "full",
                        "price": 400
                    }
                ],
                "available": true
            },
            {
                "id": 84,
                "name": "Schezwan Chopsy (Chicken)",
                "description": "Crispy chopsy topped with hot Schezwan-style chicken gravy",
                "category": "chopsy",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 130
                    },
                    {
                        "type": "full",
                        "price": 210
                    }
                ],
                "available": true
            },
            {
                "id": 85,
                "name": "American Chopsy (Chicken)",
                "description": "Crispy fried noodles topped with sweet and tangy chicken gravy",
                "category": "chopsy",
                "veg": false,
                "image": "placeholder.jpg",
                "variations": [
                    {
                        "type": "half",
                        "price": 140
                    },
                    {
                        "type": "full",
                        "price": 220
                    }
                ],
                "available": true
            }
        ]

        // App state
        let menuItems = [];
        let cart = {};
        let currentCategory = 'all';
        let currentFoodFilter = 'all';
        let tableNumber = null;
        let orderNotes = '';
        let currentRating = 0;
        let reviews = [];

        // DOM elements
        const menuContainer = document.getElementById('menu-container');
        const categoryTabs = document.querySelectorAll('.category-tab');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const totalAmountEl = document.getElementById('total-amount');
        const cartCountEl = document.getElementById('cart-count');
        const checkoutBtn = document.getElementById('checkout-btn');
        const orderModal = document.getElementById('order-modal');
        const successModal = document.getElementById('success-modal');
        const reviewModal = document.getElementById('review-modal');
        const reviewsModal = document.getElementById('reviews-modal');
        const scannerModal = document.getElementById('scanner-modal');
        const closeModalBtn = document.getElementById('close-modal');
        const closeReviewModalBtn = document.getElementById('close-review-modal');
        const closeReviewsModalBtn = document.getElementById('close-reviews-modal');
        const closeScannerModalBtn = document.getElementById('close-scanner-modal');
        const orderSummaryEl = document.getElementById('order-summary');
        const modalTotalEl = document.getElementById('modal-total');
        const confirmOrderBtn = document.getElementById('confirm-order');
        const tableNumberEl = document.getElementById('table-number');
        const orderTableNumberEl = document.getElementById('order-table-number');
        const changeTableBtn = document.getElementById('change-table-btn');
        const tableInput = document.getElementById('table-input');
        const submitTableBtn = document.getElementById('submit-table-btn');
        const orderNotesEl = document.getElementById('order-notes');
        const stars = document.querySelectorAll('.star');
        const reviewTextEl = document.getElementById('review-text');
        const submitReviewBtn = document.getElementById('submit-review');
        const viewReviewsBtn = document.getElementById('view-reviews-btn');
        const reviewsListEl = document.getElementById('reviews-list');
        const rateExperienceBtn = document.getElementById('rate-experience-btn');
        const skipReviewBtn = document.getElementById('skip-review-btn');
        const skipReviewModalBtn = document.getElementById('skip-review-modal-btn');

        // Service elements
        const servicePanel = document.getElementById('service-panel');
        const serviceMainBtn = document.getElementById('service-main-btn');
        const serviceOptions = document.querySelectorAll('.service-option');
        const serviceToast = document.getElementById('service-toast');
        const closeServiceModalBtn = document.getElementById('close-service-modal');

        // API Functions
        async function fetchMenuItems() {
            try {
                const response = await fetch(`${API_BASE}/menu`);
                if (response.ok) {
                    const menuData = await response.json();
                    return menuData;
                }
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
            return fallbackMenuItems;
        }

        async function submitOrder(orderData) {
            try {
                const response = await fetch(`${API_BASE}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Order submitted successfully:', result);
                    return result;
                } else {
                    throw new Error('Failed to submit order');
                }
            } catch (error) {
                console.error('Error submitting order:', error);
                throw error;
            }
        }

        async function submitReview(reviewData) {
            try {
                const response = await fetch(`${API_BASE}/reviews`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reviewData)
                });

                if (response.ok) {
                    return await response.json();
                }
            } catch (error) {
                console.error('Error submitting review:', error);
            }
            return { id: 'REV-' + Date.now() };
        }

        async function fetchReviews() {
            try {
                const response = await fetch(`${API_BASE}/reviews`);
                if (response.ok) {
                    return await response.json();
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
            return [];
        }

        async function sendServiceRequest(type) {
            if (!tableNumber) {
                alert('Please set your table number first');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/service-requests`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        table: tableNumber,
                        type: type,
                        customerNotes: ''
                    })
                });

                if (response.ok) {
                    _playChime();
                    _showToast('Request sent: ' + _friendlyType(type));
                }
            } catch (error) {
                console.error('Error sending service request:', error);
                _showToast('Failed to send request');
            }
        }

        // Initialize the app
        async function init() {
            // Check if table number is already set
            checkTableNumber();

            // Fetch menu from backend
            menuItems = await fetchMenuItems();

            // Fetch reviews
            reviews = await fetchReviews();

            // Render the menu
            renderMenuItems();

            // Setup event listeners
            setupEventListeners();

            // Initialize real-time updates
            initializeRealTimeUpdates();
        }

        // Check and set table number
        function checkTableNumber() {
            const urlParams = new URLSearchParams(window.location.search);
            const tableFromUrl = urlParams.get('table');
            const tableFromStorage = localStorage.getItem('hotelTableNumber');

            if (tableFromUrl) {
                setTableNumber(tableFromUrl);
            } else if (tableFromStorage) {
                setTableNumber(tableFromStorage);
            } else {
                scannerModal.style.display = 'flex';
            }
        }

        // Set table number
        function setTableNumber(number) {
            tableNumber = number;
            tableNumberEl.textContent = number;
            orderTableNumberEl.textContent = number;
            localStorage.setItem('hotelTableNumber', number);

            const newUrl = `${window.location.pathname}?table=${number}`;
            window.history.replaceState({}, '', newUrl);
        }

        // Render menu items based on current filters
        function renderMenuItems() {
            menuContainer.innerHTML = '';

            let filteredItems = menuItems;

            if (currentCategory !== 'all') {
                filteredItems = filteredItems.filter(item => item.category === currentCategory);
            }

            if (currentFoodFilter !== 'all') {
                const isVeg = currentFoodFilter === 'veg';
                filteredItems = filteredItems.filter(item => item.veg === isVeg);
            }

            if (filteredItems.length === 0) {
                menuContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-utensils"></i>
                        <h3>No items found</h3>
                        <p>Try changing your filters to see more options</p>
                    </div>
                `;
                return;
            }

            filteredItems.forEach(item => {
                const cartItem = cart[item.id] || {};
                let totalQuantity = 0;

                if (cartItem.variations) {
                    totalQuantity = Object.values(cartItem.variations).reduce((sum, qty) => sum + qty, 0);
                }

                const menuItemEl = document.createElement('div');
                menuItemEl.className = `menu-item ${!item.available ? 'unavailable' : ''}`;

                if (!item.available) {
                    menuItemEl.innerHTML = `
                        <div class="item-image">
                            <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmN2ZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzdmOGM4ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPiR7aXRlbS5uYW1lfTwvdGV4dD48L3N2Zz4='">
                            <div class="veg-indicator ${item.veg ? 'veg' : 'non-veg'}">
                                ${item.veg ? 'V' : 'NV'}
                            </div>
                        </div>
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-description">${item.description}</div>
                        </div>
                    `;
                } else {
                    menuItemEl.innerHTML = `
                        <div class="item-image">
                            <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmN2ZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzdmOGM4ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPiR7aXRlbS5uYW1lfTwvdGV4dD48L3N2Zz4='">
                            <div class="veg-indicator ${item.veg ? 'veg' : 'non-veg'}">
                                ${item.veg ? 'V' : 'NV'}
                            </div>
                        </div>
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-description">${item.description}</div>
                            ${item.variations.length > 1 ? `
                            <div class="variation-options">
                                ${item.variations.map(variation => {
                        const variationQty = cartItem.variations ? (cartItem.variations[variation.type] || 0) : 0;
                        return `
                                    <div class="variation-btn ${variationQty > 0 ? 'active' : ''}" 
                                         data-id="${item.id}" 
                                         data-variation="${variation.type}">
                                        ${variation.type.charAt(0).toUpperCase() + variation.type.slice(1)}
                                        <div class="variation-price">₹${variation.price}</div>
                                        <div class="variation-quantity">
                                            <button class="variation-qty-btn" data-id="${item.id}" data-variation="${variation.type}" data-action="decrease" ${variationQty === 0 ? 'disabled' : ''}>-</button>
                                            <span class="variation-qty-value">${variationQty}</span>
                                            <button class="variation-qty-btn" data-id="${item.id}" data-variation="${variation.type}" data-action="increase">+</button>
                                        </div>
                                    </div>
                                    `;
                    }).join('')}
                            </div>
                            ` : `
                            <div class="variation-options">
                                <div class="variation-btn active" data-id="${item.id}" data-variation="${item.variations[0].type}">
                                    ${item.variations[0].type.charAt(0).toUpperCase() + item.variations[0].type.slice(1)}
                                    <div class="variation-price">₹${item.variations[0].price}</div>
                                    <div class="variation-quantity">
                                        <button class="variation-qty-btn" data-id="${item.id}" data-variation="${item.variations[0].type}" data-action="decrease" ${totalQuantity === 0 ? 'disabled' : ''}>-</button>
                                        <span class="variation-qty-value">${totalQuantity}</span>
                                        <button class="variation-qty-btn" data-id="${item.id}" data-variation="${item.variations[0].type}" data-action="increase">+</button>
                                    </div>
                                </div>
                            </div>
                            `}
                            <div class="item-footer">
                                <div class="total-quantity">Total: ${totalQuantity}</div>
                            </div>
                        </div>
                    `;
                }

                menuContainer.appendChild(menuItemEl);
            });

            // Only add event listeners to available items
            document.querySelectorAll('.variation-qty-btn').forEach(btn => {
                btn.addEventListener('click', handleVariationQuantityChange);
            });
        }

        // Setup event listeners
        function setupEventListeners() {
            // Category tabs
            categoryTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    categoryTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    currentCategory = tab.dataset.category;
                    renderMenuItems();
                });
            });

            // Food type filter buttons
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentFoodFilter = btn.dataset.filter;
                    renderMenuItems();
                });
            });

            // Checkout button
            checkoutBtn.addEventListener('click', showOrderModal);

            // Close modal buttons
            closeModalBtn.addEventListener('click', () => {
                orderModal.style.display = 'none';
            });

            closeReviewModalBtn.addEventListener('click', () => {
                reviewModal.style.display = 'none';
                resetCart();
            });

            closeReviewsModalBtn.addEventListener('click', () => {
                reviewsModal.style.display = 'none';
            });

            closeScannerModalBtn.addEventListener('click', () => {
                if (!tableNumber) return;
                scannerModal.style.display = 'none';
            });

            // Confirm order button
            confirmOrderBtn.addEventListener('click', confirmOrder);

            // Change table button
            changeTableBtn.addEventListener('click', () => {
                scannerModal.style.display = 'flex';
            });

            // Submit table number button
            submitTableBtn.addEventListener('click', () => {
                const tableNum = tableInput.value.trim();
                if (tableNum && !isNaN(tableNum) && tableNum > 0) {
                    setTableNumber(tableNum);
                    scannerModal.style.display = 'none';
                    tableInput.value = '';
                } else {
                    alert('Please enter a valid table number');
                }
            });

            // Notes textarea
            orderNotesEl.addEventListener('input', (e) => {
                orderNotes = e.target.value;
            });

            // Star rating
            stars.forEach(star => {
                star.addEventListener('click', setRating);
                star.addEventListener('mouseover', hoverRating);
            });

            // Reset star hover
            document.querySelector('.rating-stars').addEventListener('mouseleave', resetStarHover);

            // Submit review button
            submitReviewBtn.addEventListener('click', submitReviewHandler);

            // View reviews button
            viewReviewsBtn.addEventListener('click', showReviews);

            // Rate experience button
            rateExperienceBtn.addEventListener('click', () => {
                successModal.style.display = 'none';
                reviewModal.style.display = 'flex';
            });

            // Skip review buttons
            skipReviewBtn.addEventListener('click', () => {
                successModal.style.display = 'none';
                resetCart();
            });

            skipReviewModalBtn.addEventListener('click', () => {
                reviewModal.style.display = 'none';
                resetCart();
            });

            // Close modals when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === orderModal) orderModal.style.display = 'none';
                if (e.target === reviewModal) reviewModal.style.display = 'none';
                if (e.target === reviewsModal) reviewsModal.style.display = 'none';
                if (e.target === successModal) {
                    successModal.style.display = 'none';
                    resetCart();
                }
                if (e.target === scannerModal && tableNumber) scannerModal.style.display = 'none';
            });

            // Service functionality
            serviceMainBtn.addEventListener('click', () => {
                if (servicePanel.style.display === 'flex') {
                    servicePanel.style.display = 'none';
                } else {
                    servicePanel.style.display = 'flex';
                }
            });

            serviceOptions.forEach(opt => {
                opt.addEventListener('click', () => {
                    const type = opt.dataset.type;
                    sendServiceRequest(type);
                    servicePanel.style.display = 'none';
                });
            });

        }

        // Handle variation quantity changes
        function handleVariationQuantityChange(e) {
            const itemId = parseInt(e.target.dataset.id);
            const variationType = e.target.dataset.variation;
            const action = e.target.dataset.action;

            if (!cart[itemId]) {
                cart[itemId] = { variations: {} };
            }

            if (!cart[itemId].variations) {
                cart[itemId].variations = {};
            }

            if (!cart[itemId].variations[variationType]) {
                cart[itemId].variations[variationType] = 0;
            }

            if (action === 'increase') {
                cart[itemId].variations[variationType]++;
            } else if (action === 'decrease' && cart[itemId].variations[variationType] > 0) {
                cart[itemId].variations[variationType]--;
            }

            updateCartDisplay();
            renderMenuItems();
        }

        // Update cart display
        function updateCartDisplay() {
            let total = 0;
            let count = 0;

            for (const itemId in cart) {
                const item = menuItems.find(i => i.id === parseInt(itemId));
                if (item && cart[itemId].variations) {
                    for (const variationType in cart[itemId].variations) {
                        const variation = item.variations.find(v => v.type === variationType);
                        if (variation && cart[itemId].variations[variationType] > 0) {
                            total += variation.price * cart[itemId].variations[variationType];
                            count += cart[itemId].variations[variationType];
                        }
                    }
                }
            }

            totalAmountEl.textContent = total;
            cartCountEl.textContent = count;
            checkoutBtn.disabled = count === 0;
        }

        // Show order modal
        function showOrderModal() {
            if (!tableNumber) {
                scannerModal.style.display = 'flex';
                return;
            }

            orderSummaryEl.innerHTML = '';
            let total = 0;

            for (const itemId in cart) {
                const item = menuItems.find(i => i.id === parseInt(itemId));
                if (item && cart[itemId].variations) {
                    for (const variationType in cart[itemId].variations) {
                        const variation = item.variations.find(v => v.type === variationType);
                        const quantity = cart[itemId].variations[variationType];

                        if (variation && quantity > 0) {
                            const itemTotal = variation.price * quantity;
                            total += itemTotal;

                            const orderItemEl = document.createElement('div');
                            orderItemEl.className = 'order-item';
                            orderItemEl.innerHTML = `
                                <div class="order-item-details">
                                    <div class="order-item-name">${item.name}</div>
                                    <div class="order-item-variation">${variation.type.charAt(0).toUpperCase() + variation.type.slice(1)}</div>
                                    <div class="order-item-qty">Qty: ${quantity}</div>
                                </div>
                                <div class="order-item-price">₹${itemTotal}</div>
                            `;

                            orderSummaryEl.appendChild(orderItemEl);
                        }
                    }
                }
            }

            modalTotalEl.textContent = total;
            orderModal.style.display = 'flex';
        }

        // Confirm order
        async function confirmOrder() {
            const orderData = {
                table: tableNumber,
                items: cart,
                notes: orderNotes,
                total: parseInt(modalTotalEl.textContent),
                timestamp: new Date().toISOString()
            };

            try {
                await submitOrder(orderData);
                orderModal.style.display = 'none';
                successModal.style.display = 'flex';
            } catch (error) {
                alert('Failed to place order. Please try again.');
            }
        }

        // Reset cart after order
        function resetCart() {
            cart = {};
            orderNotes = '';
            orderNotesEl.value = '';
            updateCartDisplay();
            renderMenuItems();
        }

        // Star rating functions
        function setRating(e) {
            currentRating = parseInt(e.target.dataset.rating);
            updateStars();
        }

        function hoverRating(e) {
            const rating = parseInt(e.target.dataset.rating);
            stars.forEach(star => {
                if (parseInt(star.dataset.rating) <= rating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }

        function resetStarHover() {
            updateStars();
        }

        function updateStars() {
            stars.forEach(star => {
                if (parseInt(star.dataset.rating) <= currentRating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }

        // Submit review
        async function submitReviewHandler() {
            if (currentRating === 0) {
                alert('Please select a rating');
                return;
            }

            const review = {
                rating: currentRating,
                comment: reviewTextEl.value,
                date: new Date().toLocaleDateString(),
                table: tableNumber
            };

            await submitReview(review);
            reviews.push(review);

            reviewModal.style.display = 'none';

            // Reset review form
            currentRating = 0;
            reviewTextEl.value = '';
            updateStars();

            // Reset cart
            resetCart();

            // Show success message
            alert('Thank you for your review!');
        }

        // Show reviews
        async function showReviews() {
            reviewsListEl.innerHTML = '';

            // Sort reviews by date (newest first)
            const sortedReviews = [...reviews].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });

            if (sortedReviews.length === 0) {
                reviewsListEl.innerHTML = `
                    <div class="no-reviews">
                        <i class="fas fa-star"></i>
                        <h3>No Reviews Yet</h3>
                        <p>Be the first to share your experience!</p>
                    </div>
                `;
            } else {
                sortedReviews.forEach(review => {
                    const reviewItem = document.createElement('div');
                    reviewItem.className = 'review-item';
                    reviewItem.innerHTML = `
                        <div class="review-header">
                            <div class="review-rating">
                                ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                            </div>
                            <div class="review-date">${review.date}</div>
                        </div>
                        <div class="review-comment">${review.comment || 'No comment provided'}</div>
                    `;
                    reviewsListEl.appendChild(reviewItem);
                });
            }

            reviewsModal.style.display = 'flex';
        }

        // Service request functions
        function _playChime() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = 'sine';
                o.frequency.value = 880;
                g.gain.value = 0.02;
                o.connect(g);
                g.connect(ctx.destination);
                o.start();
                setTimeout(() => {
                    o.stop();
                    ctx.close();
                }, 160);
            } catch (err) {
                // ignore audio errors
            }
        }

        function _showToast(msg = 'Request sent') {
            serviceToast.textContent = msg;
            serviceToast.style.display = 'block';
            serviceToast.style.opacity = 1;
            setTimeout(() => {
                serviceToast.style.opacity = 0;
                setTimeout(() => serviceToast.style.display = 'none', 300);
            }, 1600);
        }

        function _friendlyType(type) {
            switch (type) {
                case 'call-waiter':
                    return 'Call Waiter';
                case 'need-water':
                    return 'Need Water';
                case 'need-bill':
                    return 'Need Bill';
                case 'table-cleanup':
                    return 'Table Cleanup';
                default:
                    return type;
            }
        }

        // Initialize the app when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);