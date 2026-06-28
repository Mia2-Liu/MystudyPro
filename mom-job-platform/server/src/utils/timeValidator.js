function validateWorkTime(startTime, endTime) {
  if (!startTime || !endTime) {
    return { valid: false, message: '请设置工作时间' };
  }

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (!start || !end) {
    return { valid: false, message: '时间格式不正确' };
  }

  if (start >= end) {
    return { valid: false, message: '结束时间必须晚于开始时间' };
  }

  const minStart = parseTime('08:00');
  const maxEnd = parseTime('16:00');

  if (start < minStart) {
    return { valid: false, message: '工作开始时间不能早于早上8:00' };
  }

  if (end > maxEnd) {
    return { valid: false, message: '工作结束时间不能晚于下午4:00' };
  }

  return { valid: true };
}

function parseTime(timeStr) {
  if (!timeStr) return null;
  const parts = timeStr.split(':');
  if (parts.length < 2) return null;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

module.exports = {
  validateWorkTime,
  parseTime,
};
