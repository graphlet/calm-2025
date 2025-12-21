module.exports = {
    docs: [
        {
            type: 'doc',
            id: 'index',
            label: 'Home',
        },
        {
            type: 'category',
            label: 'Nodes',
            items: [
                'nodes/customer',
                'nodes/admin',
                'nodes/api-gateway',
                'nodes/order-service',
                'nodes/inventory-service',
                'nodes/payment-service',
                'nodes/order-db',
                'nodes/inventory-db',
                'nodes/ecommerce-platform',
                'nodes/external-payment-gateway'
            ],
        },
        {
            type: 'category',
            label: 'Relationships',
            items: [
                'relationships/customer-interacts-gateway',
                'relationships/admin-interacts-gateway',
                'relationships/gateway-to-order',
                'relationships/gateway-to-inventory',
                'relationships/order-to-orderdb',
                'relationships/order-to-payment',
                'relationships/inventory-to-inventorydb',
                'relationships/platform-composed-of',
                'relationships/payment-to-external-gateway'
            ],
        },
        {
            type: 'category',
            label: 'Flows',
            items: [
                'flows/order-processing-flow',
                'flows/inventory-check-flow'
            ],
        }
    ]
};
