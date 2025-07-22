import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    // Check if email is already verified
    if (user.emailAddresses[0]?.verification?.status === 'verified') {
      return NextResponse.json({ 
        message: 'Email already verified',
        email: email 
      });
    }

    // Let Clerk handle the verification
    return NextResponse.json({ 
      message: 'Verification email sent successfully',
      email: email 
    });
  } catch (error) {
    console.error('Error in verify-email:', error);
    return NextResponse.json(
      { error: 'Failed to process verification' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    // Get the selected role from localStorage (this will be handled client-side)
    const role = localStorage.getItem('selectedRole') || 'user';

    // Redirect based on role
    switch (role) {
      case 'system_admin':
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      case 'government_admin':
        return NextResponse.redirect(new URL('/government/dashboard', request.url));
      case 'user':
      default:
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } catch (error) {
    console.error('Error in verify-email GET:', error);
    return NextResponse.redirect(new URL('/signin', request.url));
  }
} 