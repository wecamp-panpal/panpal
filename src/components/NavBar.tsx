
import {
  AppBar,
  Box,
  Link,
  Toolbar,
  styled,
  Tooltip,
  IconButton
} from "@mui/material";
import { CircleUserRound, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

interface NavBarProps {
  onSearch?: (query: string) => void;
}

const NavBarLink = styled(Link)(({ isActive }: { isActive?: boolean }) => ({
  
  underline: "hover",
  fontWeight: "400",
  lineHeight: "24px",
  textDecoration: isActive ? "underline" : "none",
  textUnderlineOffset: 3,
  color: isActive ? "#F5E2CC" : "#FFFFFF",
  cursor: "pointer",
  "&:hover": {
    color: "#F5E2CC",
    textDecoration: "underline",
  },
  "&.Mui-selected": {
    color: "#F5E2CC",
    fontWeight: "600",
    borderBottom: "2px solid #F5E2CC",
  },
}));

const NavBar = ({ onSearch }: NavBarProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
    return <AppBar
    elevation={0}
      sx={{
        position: "fixed",
        top: 0,
        backgroundColor: "#391F06",
        justifyContent: "center",
        height: { xs: "3rem", sm: "3.5rem" },
        border: "none",
        borderWidth: "0px",
        borderStyle: "none",
        outline: "none",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
        borderRadius: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}>
        <Toolbar
        disableGutters
        sx={{
          paddingX: 2,
          justifyContent:"center",
          flexWrap: "wrap",
          minHeight: "unset !important",
        }}
      >
         <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-start",
       
            alignItems: "center",
            gap: { xs: 2, md: 4 }
          }}
        >
                  <Box
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
                <img src="/logo.svg" />
                </Box> 
                <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <NavBarLink href="/" isActive={pathname === "/"}>
                Home
              </NavBarLink>
              <NavBarLink href="/explore" isActive={pathname === "/explore"}>
                Explore Recipe
              </NavBarLink>
              <NavBarLink href="/add-recipe" isActive={pathname === "/add-recipe"}>
                Add Recipe
              </NavBarLink>
              <SearchBar PlaceHolder="Search by dish, ingredient, or chef..." onSearch={onSearch}/>
            </Box>
           
        </Box>
         <Box
            sx={{
              justifyContent:"flex-end",
              gap: 6
            }}>
               <Tooltip title="User profile">
                <IconButton>
                  <CircleUserRound color="#EAC9A3" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Settings">
                <IconButton>
                  <Settings color="#EAC9A3" />
                </IconButton>
              </Tooltip>
            </Box>
      </Toolbar>
      </AppBar>
}
export default NavBar