const express = require('express');
const cors = require('cors');
const k8s = require('@kubernetes/client-node');

const app = express();
const port = 3001; // Make sure this does not conflict with other services

// Kubernetes client setup
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);

// Middleware
app.use(cors());
app.use(express.json());

// Route to list namespaces
app.get('/namespaces', async (req, res) => {
    try {
        const { body } = await coreV1Api.listNamespace();
        res.send(body.items.map(ns => ns.metadata.name));
    } catch (err) {
        console.error('Failed to list namespaces:', err);
        res.status(500).send('Failed to list namespaces');
    }
});

// Route to list pods
app.get('/pods', async (req, res) => {
    try {
        const namespace = req.query.namespace || 'default'; // Use query to select namespace or default
        const { body } = await coreV1Api.listNamespacedPod(namespace);
        res.send(body.items.map(pod => ({
            name: pod.metadata.name,
            namespace: pod.metadata.namespace,
            status: pod.status.phase
        })));
    } catch (err) {
        console.error(`Failed to list pods in namespace ${req.query.namespace}:`, err);
        res.status(500).send('Failed to list pods');
    }
});

// Route to list ConfigMaps
app.get('/configmaps', async (req, res) => {
    try {
        const namespace = req.query.namespace || 'default'; // Use query to select namespace or default
        const { body } = await coreV1Api.listNamespacedConfigMap(namespace);
        res.send(body.items.map(cm => ({
            name: cm.metadata.name,
            namespace: cm.metadata.namespace,
            data: cm.data
        })));
    } catch (err) {
        console.error(`Failed to list ConfigMaps in namespace ${req.query.namespace}:`, err);
        res.status(500).send('Failed to list ConfigMaps');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
