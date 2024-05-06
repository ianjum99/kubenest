import React, { useState, useEffect } from 'react';
import kubeApi from '../services/kubeApi';

function NamespaceList() {
  const [namespaces, setNamespaces] = useState([]);

  useEffect(() => {
    async function fetchNamespaces() {
      try {
        const data = await kubeApi.listNamespaces();
        setNamespaces(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchNamespaces();
  }, []);

  return (
    <div>
      <h1>Namespaces</h1>
      <ul>
        {namespaces.map(ns => (
          <li key={ns}>{ns}</li>
        ))}
      </ul>
    </div>
  );
}

export default NamespaceList;
