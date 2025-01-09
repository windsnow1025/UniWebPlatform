import React from "react";
import ThemeToggle from "../../app/components/common/ThemeToggle";

const PersonalizationSettings = ({ systemTheme, setSystemTheme }) => {
  return (
    <div>
      <h2>Personalization Settings</h2>
      <ThemeToggle systemTheme={systemTheme} setSystemTheme={setSystemTheme} />
    </div>
  );
};

export default PersonalizationSettings;