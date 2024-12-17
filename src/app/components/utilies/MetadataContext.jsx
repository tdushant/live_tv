"use client";

import React, { createContext, useState, useContext } from "react";

const MetadataContext = createContext();

export const MetadataProvider = ({ children, initialMetadata }) => {
  const [metadata, setMetadata] = useState(initialMetadata);

  const updateMetadata = (newTitle, newDescription) => {
    setMetadata({
      title: newTitle,
      description: newDescription,
    });
  };

  return (
    <MetadataContext.Provider value={{ metadata, updateMetadata }}>
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetadata = () => useContext(MetadataContext);
