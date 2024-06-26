const express = require('express');
const cors = require('cors');
const k8s = require('@kubernetes/client-node');

// Initialize Express
const app = express();
const port = 3001; // Adjust the port if needed

// Middleware Setup
app.use(cors());
app.use(express.json());

// Initialize Kubernetes Client
const kc = new k8s.KubeConfig();
kc.loadFromDefault(); // Loads the configuration from the default kubeconfig location

const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);

// List Namespaces Endpoint
app.get('/namespaces', async (req, res) => {
    try {
        const { body } = await coreV1Api.listNamespace();
        res.send(body.items.map(ns => ns.metadata.name));
    } catch (err) {
        console.error('Error listing namespaces:', err);
        res.status(500).send('Failed to list namespaces');
    }
});

// List Pods Endpoint
app.get('/pods', async (req, res) => {
    try {
        const namespace = req.query.namespace || 'default'; // Defaults to the 'default' namespace
        const { body } = await coreV1Api.listNamespacedPod(namespace);
        res.send(body.items.map(pod => ({
            name: pod.metadata.name,
            namespace: pod.metadata.namespace,
            status: pod.status.phase
        })));
    } catch (err) {
        console.error(`Error listing pods in namespace ${req.query.namespace}:`, err);
        res.status(500).send('Failed to list pods');
    }
});

// List ConfigMaps Endpoint
app.get('/configmaps', async (req, res) => {
    try {
        const namespace = req.query.namespace || 'default'; // Defaults to the 'default' namespace
        const { body } = await coreV1Api.listNamespacedConfigMap(namespace);
        res.send(body.items.map(cm => ({
            name: cm.metadata.name,
            namespace: cm.metadata.namespace,
            data: cm.data
        })));
    } catch (err) {
        console.error(`Error listing configmaps in namespace ${req.query.namespace}:`, err);
        res.status(500).send('Failed to list configmaps');
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Kubernetes API server is running on http://localhost:${port}`);
});
