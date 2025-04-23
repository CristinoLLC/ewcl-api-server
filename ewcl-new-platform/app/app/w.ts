import React, { useEffect } from 'react';

const MolecularViewer = () => {
  useEffect(() => {
    const viewer = window.$3Dmol.createViewer("mol-container", {
      backgroundColor: "white",
    });
    viewer.addModel(
      "data here in PDB format", // Replace with actual PDB data
      "pdb"
    );
    viewer.setStyle({}, { stick: {} });
    viewer.zoomTo();
    viewer.render();
  }, []);

  return <div id="mol-container" style={{ width: "100%", height: "500px" }} />;
};

export default MolecularViewer;