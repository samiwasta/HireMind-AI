import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";

type CompanyAccountCreatedEmailProps = {
  companyName: string;
  email: string;
  temporaryPassword: string;
  locationLine: string;
  setPasswordLink: string;
};

export function CompanyAccountCreatedEmail({
  companyName,
  email,
  temporaryPassword,
  locationLine,
  setPasswordLink,
}: CompanyAccountCreatedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{companyName}&apos;s account has been created on HireMind</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>{companyName}&apos;s account has been created successfully</Heading>
          <Text style={paragraph}>
            Your company workspace is ready. Use the details below to get started, then set your own password using the
            button.
          </Text>
          <Section style={details}>
            <Text style={detailRow}>
              <strong>Company</strong>
              <br />
              {companyName}
            </Text>
            <Text style={detailRow}>
              <strong>Location</strong>
              <br />
              {locationLine}
            </Text>
            <Text style={detailRow}>
              <strong>Login email</strong>
              <br />
              {email}
            </Text>
            <Text style={detailRow}>
              <strong>Temporary password</strong>
              <br />
              {temporaryPassword}
            </Text>
          </Section>
          <Button href={setPasswordLink} style={button}>
            Set your password
          </Button>
          <Text style={muted}>
            For security, set a new password before using this account. This link expires in 7 days.
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
