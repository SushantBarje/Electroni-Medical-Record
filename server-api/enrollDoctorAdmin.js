/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const { buildCCDoctor, buildWallet } = require('./utils/AppUtils');
const { buildCAClient, enrollAdmin } = require('./utils/CAUtils');

const doctorMSPID = 'DoctorMSP';
const caHostName = 'ca.doctor.hospital_network.com';
const doctorAdminUsername = 'admin';
const doctorAdminPassword = 'adminpw';
const walletPath = path.join(__dirname, 'wallet/doctor');

async function main() {
    try {
        // load the network configuration
        const ccp = buildCCDoctor();
        // const ccpPath = path.resolve(__dirname, '..', 'network-config', 'organizations', 'peerOrganizations', 'doctor.hospital_network.com', 'connection-doctor.json');
        // const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caClient = buildCAClient(FabricCAServices, ccp, caHostName);
        // const caInfo = ccp.certificateAuthorities['ca.doctor.hospital_network.com'];
        // const caTLSCACerts = caInfo.tlsCACerts.pem;
        // const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const wallet = await buildWallet(Wallets, walletPath);
        // const walletPath = path.join(process.cwd(), 'wallet');
        // const wallet = await Wallets.newFileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        await enrollAdmin(caClient, wallet, doctorMSPID, doctorAdminUsername, doctorAdminPassword);
    //     const identity = await wallet.get('admin');
    //     if (identity) {
    //         console.log('An identity for the admin user "admin" already exists in the wallet');
    //         return;
    //     }

    //     // Enroll the admin user, and import the new identity into the wallet.
    //     const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    //     const x509Identity = {
    //         credentials: {
    //             certificate: enrollment.certificate,
    //             privateKey: enrollment.key.toBytes(),
    //         },
    //         mspId: 'DoctorMSP',
    //         type: 'X.509',
    //     };
    //     await wallet.put('admin', x509Identity);
    //     console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

main();