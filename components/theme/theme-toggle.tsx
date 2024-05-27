"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState } from "react";

export const ThemeToggle = () => {
  const { setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState("light");
  const handleThemeChange = () => {
    if (currentTheme === "light") {
      setTheme("dark");
      setCurrentTheme("dark");
    } else {
      setTheme("light");
      setCurrentTheme("light");
    }
  };
  return (
    <span
      onClick={handleThemeChange}
      className=" inline-block bg-blue-600 text-white p-2 hover:bg-gray-100 rounded-md cursor-pointer"
    >
      {currentTheme === "light" ? <Moon /> : <Sun />}
    </span>
  );
};
