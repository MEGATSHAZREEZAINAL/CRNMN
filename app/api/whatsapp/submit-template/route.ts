/*
// Template approval submission endpoint
// File: app/api/whatsapp/submit-template/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { twilioService } from '../../../../services/twilioService';
import { supabase } from '../../../../services/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentSid, category, language, components } = body;

    if (!contentSid || !category || !language || !components) {
      return NextResponse.json(
        { error: 'Missing required fields: contentSid, category, language, components' },
        { status: 400 }
      );
    }

    // Parse components JSON
    let parsedComponents;
    try {
      parsedComponents = typeof components === 'string' ? JSON.parse(components) : components;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON format for components' },
        { status: 400 }
      );
    }

    // Submit template for approval via Twilio
    const result = await twilioService.submitTemplateForApproval(contentSid, {
      category,
      language,
      components: parsedComponents
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Store approval submission in database
    await supabase
      .from('template_approvals')
      .upsert({
        content_sid: contentSid,
        category,
        language,
        status: 'pending',
        components: parsedComponents,
        approval_id: result.approvalId,
        submitted_at: new Date().toISOString()
      }, {
        onConflict: 'content_sid'
      });

    return NextResponse.json({
      success: true,
      approvalId: result.approvalId,
      message: 'Template submitted for approval successfully'
    });

  } catch (error) {
    console.error('❌ Error submitting template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
*/
