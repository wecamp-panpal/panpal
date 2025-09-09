import Logo from "./Logo";
import { Button } from "@mui/material";
import { getThemeColors } from "@/lib/muiTheme";

const Header = () => {
  const colors = getThemeColors();
  
  return (
    <header className="fixed top-0 left-0 w-full bg-primary px-8 py-2 shadow-md opacity-90 z-50">
      <div className="w-full flex items-center justify-between">
        {/* Logo bên trái */}
        <div className="flex items-center">
          <Logo size="sm" textColor="#FFFFFF" />
        </div>

        {/* Navigation/Actions bên phải */}
        <div className="flex items-center gap-4">
          <Button 
            variant="contained"
            sx={{
              backgroundColor: colors.background,
              color: colors.primary,
              border: `1px solid ${colors.background}`,
              borderRadius: 0,
              fontWeight: 500,
              fontFamily: 'Montserrat',
              textTransform: 'none',
              padding: '3px 30px',
              '&:hover': {
                backgroundColor: colors.background,
                opacity: 0.9,
              }
            }}
          >
            Sign Up
          </Button>
          <Button 
            variant="outlined"
            sx={{
              backgroundColor: 'transparent',
              color: colors.background,
              border: `1px solid ${colors.background}`,
              borderRadius: 0,
              fontWeight: 500,
              fontFamily: 'Montserrat',
              textTransform: 'none',
              padding: '3px 30px',
              '&:hover': {
                backgroundColor: colors.background,
                color: colors.primary,
              }
            }}
          >
            Log In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
