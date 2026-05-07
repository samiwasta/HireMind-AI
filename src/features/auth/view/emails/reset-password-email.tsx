import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

type ResetPasswordEmailProps = {
  userEmail: string;
  resetLink: string;
};

export function ResetPasswordEmail({ userEmail, resetLink }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your HireMind AI password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Reset your password</Heading>
          <Text style={paragraph}>We received a request to reset your HireMind AI password.</Text>
          <Text style={paragraph}>Account: {userEmail}</Text>
          <Button href={resetLink} style={button}>
            Reset password
          </Button>
          <Text style={muted}>
            If you did not request this, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f8fafc",
  fontFamily: "Inter, Arial, sans-serif",
  margin: 0,
  padding: "24px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "480px",
  padding: "24px",
};

const heading = {
  color: "#0f172a",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const paragraph = {
  color: "#475569",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 12px",
};

const button = {
  backgroundColor: "#6366f1",
  borderRadius: "8px",
  color: "#f8fafc",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "600",
  margin: "12px 0",
  padding: "10px 16px",
  textDecoration: "none",
};

const muted = {
  color: "#94a3b8",
  fontSize: "12px",
  lineHeight: "18px",
  marginTop: "16px",
};
