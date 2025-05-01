import React from 'react';
import { Typography, Box, Container, Divider } from '@mui/material';

const InfoPage: React.FC = () => {
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
        <Typography variant="body1" paragraph>
          <strong>Betreiber:</strong> Zum Eck'sche<br />
          Medicus Str. 26<br />
          67655 Kaiserslautern
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Kontakt:</strong><br />
          Telefon: 0631-41488411<br />
          E-Mail: info@zumeckschepizza.de
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Umsatzsteuer-ID:</strong><br />
          Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz: [Ihre USt-IdNr. einfügen]
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong><br />
          [Name des verantwortlichen Redakteurs einfügen]
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
          § 3 Erhebung technischer Daten
        </Typography>
        <Typography variant="body1" paragraph>
          Bei Zugriff auf unsere Website erheben wir automatisch technische Daten wie IP-Adresse, Browsertyp und Zugriffszeiten. Diese Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO aus unserem berechtigten Interesse an der technischen Funktionsfähigkeit und Sicherheit unserer Website.
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

      <Divider sx={{ my: 4 }} />

    </Container>
  );
};

export default InfoPage;