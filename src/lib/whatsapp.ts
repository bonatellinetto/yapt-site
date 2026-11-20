export const whatsappWidgetId = 'a28b6328-6021-4b00-8d2b-af875173ec4b';
export const whatsappScriptUrl = 'https://cdn.yapt.ai/wa-button.js';
export const whatsappConfigUrl = `https://vkrwduoawdhsbkoufurl.supabase.co/functions/v1/widget-api?action=config&instanceId=${whatsappWidgetId}`;
export const whatsappPhone = '5511913673185';
export const whatsappMessage = 'Oi! Vim pelo site e quero saber mais.';
export const whatsappHref = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`;

export interface WhatsAppConfiguration {
  is_active: true;
  wa_button_phone: string;
  wa_button_message?: string;
  wa_button_label?: string;
  wa_button_capture_fields?: string[];
}

export interface WhatsAppConfigResponse {
  success: true;
  data: WhatsAppConfiguration;
}

export type WhatsAppAPI = (command: 'init' | 'open' | 'close', options?: { id: string; mode: 'both' }) => void;

export function validWhatsAppConfiguration(payload: unknown): payload is WhatsAppConfigResponse {
  if (!payload || typeof payload !== 'object' || !('success' in payload) || payload.success !== true || !('data' in payload)) return false;
  const data = payload.data;
  if (!data || typeof data !== 'object' || !('is_active' in data) || data.is_active !== true || !('wa_button_phone' in data)) return false;
  if ('wa_button_label' in data && data.wa_button_label !== undefined && typeof data.wa_button_label !== 'string') return false;
  if ('wa_button_message' in data && data.wa_button_message !== undefined && typeof data.wa_button_message !== 'string') return false;
  if ('wa_button_capture_fields' in data && data.wa_button_capture_fields !== undefined
    && (!Array.isArray(data.wa_button_capture_fields) || !data.wa_button_capture_fields.every(field => typeof field === 'string'))) return false;
  return typeof data.wa_button_phone === 'string' && data.wa_button_phone.replace(/\D/g, '').length >= 8;
}
