import React from 'react'
import Navigation from './app/components/navigation/Navigation'
import { extendTheme, NativeBaseProvider } from "native-base";

const newColorTheme = {
  brand: {
    900: "#8287af",
    800: "#7c83db",
    700: "#b3bef6",
  },
};
const theme = extendTheme({ colors: newColorTheme });

export default function App() {
  return (
    <>
      <NativeBaseProvider theme={theme}>
        <Navigation />
      </NativeBaseProvider>
    </>
  )
}