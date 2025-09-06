import { Box } from "@mui/material";


const Footer = () => {
    return (
    <Box
      component="footer"
      sx={{
        width: "100%",                  // full width
        backgroundColor: "#391F06",
        color: "#F5E2CC",
        textAlign: "center",

        height: { xs: 80, sm: 100, md: 120, lg: 148 },

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        gap: 1,
      }}
    >
      <img src="/logo.svg" alt="PanPal logo" style={{ width: 50 }} />
      <span>© 2025 PanPal. All rights reserved.</span>
    </Box>
  );
  
};
export default Footer;
