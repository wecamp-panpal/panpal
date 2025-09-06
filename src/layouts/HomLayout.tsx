import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "@/components/footer";

export default function HomeLayout() {
  return (
    <div  style={{
        minHeight: "100vh",      
        flexDirection: "column",
      }}>
      <NavBar />
      <main style={{ flex: 1 }}>
        <Outlet /> 
      </main >
      <Footer />
    </div>
  );
}

