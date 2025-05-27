import React from 'react';
import { Typography, Box, Container, Divider } from '@mui/material';

const InfoPage: React.FC = () => {

  const INFO_EMAIL = import.meta.env.VITE_INFO_EMAIL;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Impressum nach § 5 TMG */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Impressum
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Angaben gemäß § 5 TMG:
        </Typography>
        <Typography variant="body1">
          <strong>Betreiber:</strong> Zum Eck'sche<br />
          Medicus Str. 26<br />
          67655 Kaiserslautern
        </Typography>
        <Typography variant="body1">
          <strong>Kontakt:</strong><br />
          Telefon: 0631-41488411<br />
          E-Mail: {INFO_EMAIL}
        </Typography>
        <Typography variant="body1">
          <strong>Umsatzsteuer-ID:</strong><br />
          Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz: 19/057/34574
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Zusatzstoffe und Allergene */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Zusatzstoffe und Allergene
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Zusatzstoffe:
        </Typography>
        <Typography variant="body1" paragraph>
          1: mit Farbstoff, 2: mit Konservierungsstoff, 3: mit Antioxidationsmittel, 4: mit Geschmacksverstärker, 5: geschwärzt, 6: mit Süßungsmittel, 7: enthält eine Phenylalaninquelle, 8: phosphathaltig, 9: chininhaltig, 10: coffeinhaltig
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Allergene:
        </Typography>
        <Typography variant="body1" paragraph>
          a: enthält glutenhaltiges Weizengetreide/-Erzeugnisse, b: enthält Krebstiere, c: enthält Ei, d: enthält Fisch, e: enthält Nüsse, f: enthält Soja, g: enthält Milch, h: enthält Schalenfrüchte, i: enthält Sellerie, j: enthält Senf, k: enthält Sesam, l: enthält Sulfite
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Datenschutz nach DSGVO/BDSG */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Datenschutzerklärung
        </Typography>

        <Typography variant="body1" paragraph>
          Verantwortlicher im Sinne der Datenschutzgesetze, insbesondere der EU-Datenschutzgrundverordnung (DSGVO) und des Bundesdatenschutzgesetzes (BDSG):
        </Typography>
        <Typography variant="body1" paragraph>
          Zum Eck'sche<br />
          Medicus Str. 26<br />
          67655 Kaiserslautern
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          § 1 Erhebung personenbezogener Daten
        </Typography>
        <Typography variant="body1" paragraph>
          (1) Personenbezogene Daten sind alle Daten, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen.
        </Typography>
        <Typography variant="body1" paragraph>
          (2) Wir erheben und verarbeiten Ihre Daten nur, soweit dies für die Begründung, inhaltliche Ausgestaltung oder Änderung des Rechtsverhältnisses erforderlich ist (Bestandsdaten). Dies erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          § 2 Ihre Rechte nach DSGVO
        </Typography>
        <Typography variant="body1" paragraph>
          Sie haben uns gegenüber bezüglich Ihrer Daten folgende Rechte:
        </Typography>
        <Typography variant="body1" component="ul" paragraph sx={{ pl: 2 }}>
          <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
          <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
          <li>Recht auf Löschung (Art. 17 DSGVO)</li>
          <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
        </Typography>
        <Typography variant="body1" paragraph>
          Zudem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren (Art. 77 DSGVO).
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          § 4 Cookies
        </Typography>
        <Typography variant="body1" paragraph>
          Wir verwenden technisch notwendige Cookies gemäß § 25 Abs. 2 TTDSG. Für alle anderen Cookie-Typen holen wir Ihre Einwilligung gemäß § 25 Abs. 1 TTDSG ein.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          § 5 Bestellabwicklung
        </Typography>
        <Typography variant="body1" paragraph>
          Für Vertragsabwicklung verarbeiten wir Ihre Adress-, Kontakt- und Bestelldaten. Die Datenverarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. b DSGVO zur Vertragserfüllung.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          § 6 Zahlungsdienstleister
        </Typography>
        <Typography variant="body1" paragraph>
          Bei Zahlung via PayPal, Kreditkarte oder anderen Anbietern werden Ihre Zahlungsdaten direkt an den jeweiligen Anbieter übermittelt. Dies erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.
        </Typography>
      </Box>
    </Container>
  );
};

export default InfoPage;