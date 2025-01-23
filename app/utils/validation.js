import validator from 'validator';
import sanitizeHtml from 'sanitize-html';

export function validateEmail(email) {
  return validator.isEmail(email);
}

export function sanitizeInput(input) {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

export function validateContactForm(data) {
  const errors = {};
  
  // Sanitize inputs
  const name = sanitizeInput(data.name || '');
  const email = sanitizeInput(data.email || '');
  const subject = sanitizeInput(data.subject || '');
  const message = sanitizeInput(data.message || '');

  // Validate name
  if (!name || name.length < 2) {
    errors.name = 'الاسم يجب أن يكون أكثر من حرفين';
  }

  // Validate email
  if (!email || !validateEmail(email)) {
    errors.email = 'البريد الإلكتروني غير صحيح';
  }

  // Validate subject
  if (!subject || subject.length < 3) {
    errors.subject = 'الموضوع يجب أن يكون أكثر من 3 أحرف';
  }

  // Validate message
  if (!message || message.length < 10) {
    errors.message = 'الرسالة يجب أن تكون أكثر من 10 أحرف';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: {
      name,
      email,
      subject,
      message
    }
  };
} 