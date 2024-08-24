"use client";
import { useRouter } from 'next/navigation';
import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import StoreIcon from '@mui/icons-material/Store';
const actions = [
  { icon: <FileCopyIcon />, name: 'Upload', href: '/additem' },
  { icon: <SaveIcon />, name: 'Update', href: '/Components/update' },
  { icon: <RestoreFromTrashIcon />, name: 'Delete', href: '/Components/delete' },
  { icon: <StoreIcon />, name: 'Orders', href: '/Components/orders' },
];

export default function Plus() {
  const router = useRouter();

  return (
    <Box sx={{ position: 'fixed', bottom: 33, right: 56 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        icon={<SpeedDialIcon />}
        direction="up"
        sx={{ transform: 'translateZ(0px)' }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => router.push(action.href)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
