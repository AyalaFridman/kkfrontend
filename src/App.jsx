import React from 'react';
import './App.css'
import { ThemeProvider, createTheme, CssBaseline, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Needy_list from './components/needy/needy-list'
import NeedyDetails from './components/needy/needy-details'
import Add_needy from './components/needy/add-needy'
import BankDetails from './components/needy/bank-details';
import Project_list from './components/projects/project-list';
import Project_Details from './components/projects/project-details'
import Header from './components/header';
import Home from './components/home';
import Add_project from './components/projects/add-project'
import NeedyProps from './components/needy/needy-prop';
import Allocation_list from './components/allocations/allocation-list';
import Add_allocation from './components/allocations/add-allocation';
import AllocationDetails from './components/allocations/allocation-details';
import Fund_list from './components/funds/funds-list';
import Fund_Details from './components/funds/fund-details';
import Direct_family_Funds_list from './components/funds/direct-family-funds';
import Add_fund from './components/funds/add-fund';
import Supported_list from './components/supported/supported-list';
import Add_supported from './components/supported/add-supported';
import Donors_list from './components/donors/donors-list';
import Donors_keva_list from './components/donors/donors-keva-list';
import KevaDetails from './components/donors/keva-details';
import DonorDetails from './components/donors/donor-detils';
import DonationsList from './components/donors/reg-donation-list';
import ServiceProvider_list from './components/service-providers/service-provider-list';
import ServiceProviderDetails from './components/service-providers/service-provider-details';
import AddServiceProvider from './components/service-providers/add-service-provider';
import Add_special_supported from './components/supported/add-special-support';
import Graphs from './components/graphs';
import { FileProvider } from './components/bank-file/file_context';

function App() {


  return (
    <FileProvider>
      <Router>
        <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <Box
            sx={{
              flexGrow: 1,
              width: '100%',
              padding: 2,
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/Needy_list" element={<Needy_list />} />
              <Route path="NeedyProp/:id" element={<NeedyProps />} />
              <Route path="NeedyDetails" element={<NeedyDetails />} />
              <Route path="/newNeedy" element={<Add_needy />} />
              <Route path="/bankDetails" element={<BankDetails />} />
              <Route path="/Project_list" element={<Project_list />} />
              <Route path="Add_project" element={<Add_project />} />
              <Route path="/allocations" element={<Allocation_list />} />
              <Route path="allocationsDetails/:id/:projectId" element={<AllocationDetails />} />
              <Route path="allocations/project/:project_id" element={<Allocation_list />} />
              <Route path="allocations/fund/:fund_id" element={<Allocation_list />} />
              <Route path="Add_allocation" element={< Add_allocation />} />
              <Route path="Add_allocation/p/:project_id" element={< Add_allocation />} />
              <Route path="Add_allocation/f/:fund_id" element={< Add_allocation />} />
              <Route path="/Fund_list" element={<Fund_list />} />
              <Route path="/Direct_family_Funds_list" element={<Direct_family_Funds_list />} />
              <Route path="Add_fund" element={<Add_fund />} />
              <Route path="supported" element={<Supported_list />} />
              {/* <Route path="supported/:needy_id" element={<Supported_list />} /> */}
              <Route path="Add_supported" element={<Add_supported />} />
              <Route path="Add_supported/:needy_id" element={<Add_supported />} />
              <Route path="Add_special_supported" element={<Add_special_supported />} />
              <Route path="Add_special_supported/:needy_id" element={<Add_special_supported />} />
              <Route path="donors" element={<Donors_list />} />
              <Route path="donors_keva" element={<Donors_keva_list />} />
              <Route path="reg_donation" element={<DonationsList />} />
              <Route path="DonorDetails/:id" element={<DonorDetails />} />
              <Route path="/ServiceProviders" element={<ServiceProvider_list />} />
              <Route path="ServiceProviderDetails/:id" element={<ServiceProviderDetails />} />
              <Route path="add_serviceProvider" element={<AddServiceProvider />} />
              <Route path='graphs' element={<Graphs />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </FileProvider>
  );
}

export default App
