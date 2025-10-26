import * as React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Page(): React.JSX.Element {
  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            component="img"
            src="/assets/logoSplitPay.png"
            alt="SplitPay"
            sx={{ width: { xs: '100%', sm: 360 }, maxWidth: 520, height: 'auto' }}
          />        
      </Box>

      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          component={Link}
          href="/dashboard/splitpay"
          variant="contained"
          size="large"
          sx={{
            width: { xs: '92%', sm: 520 },
            maxWidth: 720,
            py: { xs: 2, sm: 2.5 },
            fontSize: { xs: '1.05rem', sm: '1.125rem' },
            borderRadius: 3,
          }}
        >
          Iniciar Split
        </Button>
      </Box>
    </Box>
  );
}
