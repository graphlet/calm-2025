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
                'nodes/api-endpoint',
                'nodes/message-processor',
                'nodes/message-store',
                'nodes/email-provider',
                'nodes/webhook-target',
                'nodes/identity-provider',
                'nodes/kafka-event-bus'
            ],
        },
        {
            type: 'category',
            label: 'Relationships',
            items: [
                'relationships/api-to-identity-provider',
                'relationships/api-to-processor',
                'relationships/processor-to-message-store',
                'relationships/processor-to-kafka',
                'relationships/kafka-to-email-provider',
                'relationships/kafka-to-webhook-target'
            ],
        },
        {
            type: 'category',
            label: 'Flows',
            items: [
                'flows/user-registration-welcome-email-flow'
            ],
        }
    ]
};
