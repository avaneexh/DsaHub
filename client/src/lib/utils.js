function getLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    63: "JavaScript",
    71: "Python",
    62: "Java",
  };
  return LANGUAGE_NAMES[languageId] || "Unknown";
}

export { getLanguageName };

export function getLanguageId(language) {
  const languageMap = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
  };
  return languageMap[language.toUpperCase()];
}

export const formatSubmissionStatus = (status) => {
  switch (status) {
    case "ACCEPTED":
      return "Accepted";
    case "WRONG_ANSWER":
      return "Wrong Answer";
    default:
      return status;
  }
};

export const formatTestCasesFromSubmission = (submission) => {
  if (!submission) return [];

  const parseJSON = (value, fallback = []) => {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  };

  const inputs = submission.stdin
    ? submission.stdin
        .split("\n")
        .map((i) => i.trim())
        .filter(Boolean)
    : [];

  const outputs = parseJSON(submission.stdout);
  const times = parseJSON(submission.time);
  const memories = parseJSON(submission.memory);

  const maxLen = Math.max(
    inputs.length,
    outputs.length,
    times.length,
    memories.length
  );

  return Array.from({ length: maxLen }).map((_, idx) => {
    const expected = outputs[idx] ?? "N/A";
    const actual = outputs[idx] ?? "N/A";

    return {
      input: inputs[idx] ?? "N/A",
      expected,
      stdout: actual,
      time: times[idx] ?? "—",
      memory: memories[idx] ?? "—",
      passed: submission.status === "ACCEPTED",
    };
  });
};
