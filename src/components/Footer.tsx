import { Typography, Box } from "@mui/material";
import { getThemeColors } from "@/lib/muiTheme";
import Logo from "./Logo";

const Footer = () => {
  const colors = getThemeColors();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: colors.primary, // Màu nâu
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        padding: '60px 4%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }}
    >
      {/* Logo ở giữa */}
      <div className="flex justify-center">
        <Logo size="md" textColor="#FFFFFF" />
      </div>
      
      {/* Copyright text */}
      <Typography 
        sx={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '16px',
          fontWeight: 400,
          color: '#FFFFFF',
          textAlign: 'center'
        }}
      >
        © 2025 PanPal. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
