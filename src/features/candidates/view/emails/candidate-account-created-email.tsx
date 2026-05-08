import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";

type CandidateAccountCreatedEmailProps = {
  fullName: string;
  email: string;
  loginLink: string;
};

export function CandidateAccountCreatedEmail({ fullName, email, loginLink }: CandidateAccountCreatedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your HireMind candidate account is ready</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Your candidate account is ready</Heading>
          <Text style={paragraph}>Hi {fullName}, welcome to HireMind.</Text>
          <Text style={paragraph}>Your candidate account was created successfully. Use these details to sign in:</Text>
          <Section style={details}>
            <Text style={detailRow}>
              <strong>Name</strong>
              <br />
              {fullName}
            </Text>
            <Text style={detailRow}>
              <strong>Login email</strong>
              <br />
              {email}
            </Text>
          </Section>
          <Text style={paragraph}>
            Use the password you created during registration and continue from your candidate dashboard.
          </Text>
          <Button href={loginLink} style={button}>
            Open HireMind login
          </Button>
          <Text style={muted}>
            If the button does not work, copy and paste this link into your browser: {loginLink}
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
  fontSize: "22px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const paragraph = {
  color: "#475569",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 16px",
};

const details = {
  backgroundColor: "#f1f5f9",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
};

const detailRow = {
  color: "#334155",
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
  margin: "8px 0",
  padding: "12px 20px",
  textDecoration: "none",
};

const muted = {
  color: "#94a3b8",
  fontSize: "12px",
  lineHeight: "18px",
  marginTop: "16px",
};
