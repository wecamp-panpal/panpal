import { useState } from "react";
import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>Testing</p>
      <Button variant="default" onClick={() => {setCount(count + 1)}}>Button from ShadcnUI</Button>
    </>
  );
}

export default App;
