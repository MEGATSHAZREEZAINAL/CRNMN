/*
// Template status check endpoint
// File: app/api/whatsapp/template-status/[contentSid]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { twilioService } from '../../../../../services/twilioService';
import { supabase } from '../../../../../services/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { contentSid: string } }
) {
  try {
    const { contentSid } = params;

    if (!contentSid) {
      return NextResponse.json(
        { error: 'Content SID is required' },
        { status: 400 }
      );
    }

    // Get status from Twilio
    const twilioResult = await twilioService.getTemplateApprovalStatus(contentSid);
    
    if (!twilioResult.success) {
      return NextResponse.json(
        { error: twilioResult.error },
        { status: 500 }
      );
    }

    // Get local status from database
    const { data: localStatus } = await supabase
      .from('template_approvals')
      .select('*')
      .eq('content_sid', contentSid)
      .single();

    // Update local status if it has changed
    if (localStatus && twilioResult.status && localStatus.status !== twilioResult.status) {
      const updateData: any = {
        status: twilioResult.status,
        updated_at: new Date().toISOString()
      };

      if (twilioResult.status === 'approved') {
        updateData.approved_at = new Date().toISOString();
      } else if (twilioResult.status === 'rejected') {
        updateData.rejected_at = new Date().toISOString();
        updateData.rejection_reason = twilioResult.details?.rejection_reason || 'No reason provided';
      }

      await supabase
        .from('template_approvals')
        .update(updateData)
        .eq('content_sid', contentSid);
    }

    const response = {
      success: true,
      contentSid,
      status: twilioResult.status,
      details: twilioResult.details,
      localRecord: localStatus,
      canUseForOutbound: twilioService.canUseTemplateForOutbound(
        twilioResult.status!, 
        twilioResult.details?.content_type || 'twilio/text'
      ),
      canUseForInboundReply: twilioService.canUseTemplateForInboundReply(
        twilioResult.status!, 
        twilioResult.details?.content_type || 'twilio/text'
      ),
      approvalRequirements: twilioService.getApprovalRequirements(
        twilioResult.details?.content_type || 'twilio/text'
      )
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error checking template status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
*/
