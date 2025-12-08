export type StreamEventType =
  | 'message'
  | 'done'
  | 'error';

export interface StreamEvent {
  type: StreamEventType;
  data?: any;
}
