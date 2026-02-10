import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";

const AuthCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 460,
  padding: theme.spacing(4),
  margin: "auto",

  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),

  background:
    "linear-gradient(180deg, rgba(2,6,23,0.97), rgba(2,6,23,0.92))",
  backdropFilter: "blur(22px)",

  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 16,

  boxShadow:
    "0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
}));

export default AuthCard;
