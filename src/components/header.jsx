import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import ButtonGroup from '@mui/material/ButtonGroup';
import DownloadButton from './bank-file/save_bank_transfers';


const pages = [
    { name: 'דף הבית', path: '/' },
    { name: 'אנשי קשר', path: '/Needy_list' },
    { name: 'נותני שירות', path: '/ServiceProviders' },
    { name: 'פרוייקטים', path: '/Project_list' },
    { name: 'קרנות תומכות', path: '/Fund_list' },
    { name: 'קרנות למשפחות', path: '/Direct_family_Funds_list' },
    { name: 'חלוקות', path: '/allocations' },
    { name: 'תמיכות', path: '/supported' },
    { name: 'תורמים', path: '/donors' },
    { name: 'הוראות קבע', path: '/donors_keva' },
    { name: 'הוראות קבע דרך מס"ב', path: '/masabKeva' },
    { name: 'תרומות בהעברה בנקאית', path: '/Bank_Donation' },
    { name: 'תרומות', path: '/reg_donation' },
    { name: 'גרפים ודיאגרמות', path: '/graphs' }
];

export default function Header() {
    return (
        <AppBar position="static" sx={{ bgcolor: 'primary', paddingY: '0.5rem', boxShadow: 'none' }}>
            <Toolbar
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: 'black',
                        textAlign: 'center',
                        width: '100%',
                        paddingBottom: '1rem',
                    }}
                >
                    קופת כרמיאל
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        overflowX: 'auto',
                        gap: 0.4,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        paddingX: '1rem',
                    }}
                >
                    {pages.map((page) => (
                        <Button
                            key={page.name}
                            component={Link}
                            to={page.path}
                            sx={{
                                color: '#333333',
                                fontSize: '14px',
                                textTransform: 'none',
                                backgroundColor: '#F0EFFF',
                                border: '2px solid #D3C4F3',
                                borderRadius: '8px',
                                padding: '0.3rem',
                                whiteSpace: 'nowrap',
                                minWidth: 'auto',
                                '&:hover': {
                                    backgroundColor: '#E0D9FA',
                                    borderColor: '#B5A7E8',
                                }
                            }}
                        >
                            {page.name}
                        </Button>
                    ))}
                    <DownloadButton />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
