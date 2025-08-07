import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import crypto from "crypto";

/*
  ASSIGN ROLE:
    Endpoint: /api/assignRole
    Method: POST
    Params: { email: string, role: string, club?: string }
    Headers: { X-Token: Firebase ID Token, X-ClubToken: Club Token }
*/

!getApps().length ? initializeApp({credential: cert(JSON.parse(process.env.CREDS || ""))}) : getApp();

export async function POST(req: NextRequest) {
  try {
    const { email, role, club } = await req.json();
    const token = req.headers.get('X-Token');

    // Validate tokens
    if (!token) {
      return NextResponse.json(
        { success: false, msg: 'Unauthorized - Missing tokens.' },
        { status: 401 }
      );
    }

    // Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(token);
    } catch (e) {
      return NextResponse.json(
        { success: false, msg: 'Unauthorized - Invalid token.' },
        { status: 401 }
      );
    }

    // Get user data to check permissions
    const db = getFirestore();
    const currentUserDoc = await db.collection('users').doc(decodedToken.uid).get();
    const currentUserData = currentUserDoc.data();

    if (!currentUserData) {
      return NextResponse.json(
        { success: false, msg: 'User not found.' },
        { status: 404 }
      );
    }

    // Check if user has permission to assign roles (Admin or Club Lead)
    if (!['Club Lead', 'Admin'].includes(currentUserData.role)) {
      return NextResponse.json(
        { success: false, msg: 'Insufficient permissions to assign roles.' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!email || !role) {
      return NextResponse.json(
        { success: false, msg: 'Email and role are required.' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['Student', 'Club Lead', 'Club Manager'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, msg: 'Invalid role specified.' },
        { status: 400 }
      );
    }

    // Find user by email
    const usersRef = db.collection('users');
    const querySnapshot = await usersRef.where('email', '==', email).get();

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, msg: 'User not found with the specified email.' },
        { status: 404 }
      );
    }

    // Should only be one user with this email
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Check if the user is already assigned the same role or if the role is admin
    if (userData.role === role && (role !== 'Club Lead' && role !== 'Club Manager') || userData.role === 'Admin') {
      return NextResponse.json(
        { success: false, msg: `User already has the ${role} role.` },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      role: role,
      updatedAt: new Date().toISOString()
    };

    // If role requires a club and club is provided, add it
    if ((role === 'Club Lead' || role === 'Club Manager') && club) {
      updateData.club = club;
    }

    // Update the user document
    await userDoc.ref.update(updateData);

    return NextResponse.json({
      success: true,
      msg: `Successfully assigned ${role} role to ${email}`,
      data: {
        email: email,
        role: role,
        club: club || userData.club || null,
        previousRole: userData.role
      }
    });

  } catch (error) {
    console.error('Error assigning role:', error);
    return NextResponse.json(
      { success: false, msg: 'Internal server error.' },
      { status: 500 }
    );
  }
}
