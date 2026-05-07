import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

type NewUserCredentialsEmailProps = {
  fullName: string;
  email: string;
  password: string;
  loginLink: string;
};

export function NewUserCredentialsEmail({
  fullName,
  email,
  password,
  loginLink,
}: NewUserCredentialsEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your HireMind AI account credentials</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome to HireMind AI</Heading>
          <Text style={paragraph}>Hi {fullName}, your account has been created.</Text>
          <Text style={paragraph}>
            <strong>Email:</strong> {email}
          </Text>
          <Text style={paragraph}>
            <strong>Password:</strong> {password}
          </Text>
          <Button href={loginLink} style={button}>
            Login to HireMind AI
          </Button>
          <Text style={muted}>
            For security, please change this password after your first login if instructed.
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
  maxWidth: "520px",
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
