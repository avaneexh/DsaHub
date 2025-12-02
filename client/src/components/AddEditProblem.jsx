import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Editor from "@monaco-editor/react";
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
} from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
});

const blankDefaults = {
  title: "",
  description: "",
  difficulty: "EASY",
  tags: [""],
  constraints: "",
  hints: "",
  editorial: "",
  testcases: [{ input: "", output: "" }],
  examples: {
    JAVASCRIPT: { input: "", output: "", explanation: "" },
    PYTHON: { input: "", output: "", explanation: "" },
    JAVA: { input: "", output: "", explanation: "" },
  },
  codeSnippets: {
    JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
    PYTHON: "def solution():\n    # Write your code here\n    pass",
    JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
  },
  referenceSolutions: {
    JAVASCRIPT: "// Add your reference solution here",
    PYTHON: "# Add your reference solution here",
    JAVA: "// Add your reference here",
  },
};

const AddEditProblem = ({ isEdit = false, editingProblem = null }) => {
  const navigate = useNavigate();
  const [sampleType, setSampleType] = useState("DP");
  const [isLoading, setIsLoading] = useState(false);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: editingProblem ? { ...blankDefaults, ...editingProblem } : blankDefaults,
  });

  useEffect(() => {
    if (isEdit && editingProblem) {
      reset({ ...blankDefaults, ...editingProblem });
    }
  }, [isEdit, editingProblem, reset]);

  const { fields: testCaseFields, append: appendTestCase, remove: removeTestCase, replace: replaceTestcases } = useFieldArray({
    control,
    name: "testcases",
  });

  const { fields: tagFields, append: appendTag, remove: removeTag, replace: replaceTags } = useFieldArray({
    control,
    name: "tags",
  });

  const onSubmit = async (value) => {
    try {
      setIsLoading(true);
      if (isEdit && editingProblem?.id) {
        const res = await axiosInstance.put(`/problems/${editingProblem.id}`, value);
        toast.success(res.data?.message || "Problem updated successfully");
      } else {
        const res = await axiosInstance.post("/problems/create-problem", value);
        toast.success(res.data?.message || "Problem created successfully");
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Error submitting problem");
    } finally {
      setIsLoading(false);
    }
  };

  const sampledpData = {
  title: "Climbing Stairs",
  category: "dp", // Dynamic Programming
  description:
    "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization"],
  constraints: "1 <= n <= 45",
  hints:
    "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial:
    "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
  testcases: [
    {
      input: "2",
      output: "2",
    },
    {
      input: "3",
      output: "3",
    },
    {
      input: "4",
      output: "5",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: "n = 2",
      output: "2",
      explanation:
        "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
    },
    PYTHON: {
      input: "n = 3",
      output: "3",
      explanation:
        "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
    },
    JAVA: {
      input: "n = 4",
      output: "5",
      explanation:
        "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Write your code here
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Write your code here
      return 0;
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Base cases
if (n <= 2) {
  return n;
}

// Dynamic programming approach
let dp = new Array(n + 1);
dp[1] = 1;
dp[2] = 2;

for (let i = 3; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
}

return dp[n];

/* Alternative approach with O(1) space
let a = 1; // ways to climb 1 step
let b = 2; // ways to climb 2 steps

for (let i = 3; i <= n; i++) {
  let temp = a + b;
  a = b;
  b = temp;
}

return n === 1 ? a : b;
*/
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Base cases
      if n <= 2:
          return n
      
      # Dynamic programming approach
      dp = [0] * (n + 1)
      dp[1] = 1
      dp[2] = 2
      
      for i in range(3, n + 1):
          dp[i] = dp[i - 1] + dp[i - 2]
      
      return dp[n]
      
      # Alternative approach with O(1) space
      # a, b = 1, 2
      # 
      # for i in range(3, n + 1):
      #     a, b = b, a + b
      # 
      # return a if n == 1 else b

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Base cases
      if (n <= 2) {
          return n;
      }
      
      // Dynamic programming approach
      int[] dp = new int[n + 1];
      dp[1] = 1;
      dp[2] = 2;
      
      for (int i = 3; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
      }
      
      return dp[n];
      
      /* Alternative approach with O(1) space
      int a = 1; // ways to climb 1 step
      int b = 2; // ways to climb 2 steps
      
      for (int i = 3; i <= n; i++) {
          int temp = a + b;
          a = b;
          b = temp;
      }
      
      return n == 1 ? a : b;
      */
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
  },
};


  const sampleStringProblem = {
  title: "Valid Palindrome",
  description:
    "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
  difficulty: "EASY",
  tags: ["String", "Two Pointers"],
  constraints:
    "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
  hints:
    "Consider using two pointers, one from the start and one from the end, moving towards the center.",
  editorial:
    "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
  testcases: [
    {
      input: "A man, a plan, a canal: Panama",
      output: "true",
    },
    {
      input: "race a car",
      output: "false",
    },
    {
      input: " ",
      output: "true",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    PYTHON: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    JAVA: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Write your code here
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Write your code here
          pass
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
       
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Convert to lowercase and remove non-alphanumeric characters
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if it's a palindrome
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
      if (s[left] !== s[right]) {
        return false;
      }
      left++;
      right--;
    }
    
    return true;
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Convert to lowercase and keep only alphanumeric characters
          filtered_chars = [c.lower() for c in s if c.isalnum()]
          
          # Check if it's a palindrome
          return filtered_chars == filtered_chars[::-1]
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        s = preprocess(s);
        int left = 0, right = s.length() - 1;

        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }

        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
  },
};

  const loadSampleData = () => {
    const sample = sampleType === "DP" ? sampledpData : sampleStringProblem;
    replaceTags(sample.tags.map((t) => t));
    replaceTestcases(sample.testcases.map((tc) => tc));
    reset({ ...blankDefaults, ...sample });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="card bg-base-100 shadow-xl rounded-2xl border border-gray-800">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-gray-800" />
              <h2 className="text-2xl font-semibold">{isEdit ? "Edit Problem" : "Create Problem"}</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="btn-group">
                <button type="button" className={`btn btn-sm ${sampleType === "DP" ? "btn-active" : ""}`} onClick={() => setSampleType("DP")}>DP</button>
                <button type="button" className={`btn btn-sm ${sampleType === "STRING" ? "btn-active" : ""}`} onClick={() => setSampleType("STRING")}>String</button>
              </div>
              <button className="btn btn-outline btn-sm" type="button" onClick={loadSampleData}>
                <Download className="w-4 h-4 mr-2" /> Load Sample
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label"><span className="label-text">Title</span></label>
                <input className="input input-bordered w-full bg-white text-black" {...register("title")} />
                {errors.title && <p className="text-sm text-error mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="label"><span className="label-text">Difficulty</span></label>
                <select className="select select-bordered w-full bg-white text-black" {...register("difficulty")}>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
                {errors.difficulty && <p className="text-sm text-error mt-1">{errors.difficulty.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="label"><span className="label-text">Description</span></label>
                <textarea className="textarea textarea-bordered w-full min-h-[120px] bg-white text-black" {...register("description")} />
                {errors.description && <p className="text-sm text-error mt-1">{errors.description.message}</p>}
              </div>
            </div>

            {/* Tags */}
            <div className="card bg-gray-50 border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><BookOpen /> <h3 className="font-medium">Tags</h3></div>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => appendTag("")}> <Plus className="w-4 h-4 mr-2"/> Add Tag</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {tagFields.map((f, i) => (
                  <div key={f.id} className="flex items-center gap-2">
                    <input className="input input-bordered w-full bg-white text-black" {...register(`tags.${i}`)} />
                    <button type="button" className="btn btn-ghost btn-square btn-sm" onClick={() => removeTag(i)} disabled={tagFields.length === 1}>
                      <Trash2 />
                    </button>
                  </div>
                ))}
              </div>
              {errors.tags && <p className="text-sm text-error mt-2">{errors.tags.message}</p>}
            </div>

            {/* Testcases */}
            <div className="card bg-gray-50 border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><CheckCircle2 /> <h3 className="font-medium">Test Cases</h3></div>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => appendTestCase({ input: "", output: "" })}><Plus className="w-4 h-4 mr-2"/> Add</button>
              </div>

              <div className="space-y-4">
                {testCaseFields.map((f, idx) => (
                  <div key={f.id} className="card bg-white border border-gray-200 p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Test Case #{idx + 1}</h4>
                      <button type="button" className="btn btn-ghost btn-sm text-error" onClick={() => removeTestCase(idx)} disabled={testCaseFields.length === 1}><Trash2 /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="label"><span className="label-text">Input</span></label>
                        <textarea className="textarea textarea-bordered min-h-20 bg-white text-black" {...register(`testcases.${idx}.input`)} />
                        {errors.testcases?.[idx]?.input && <p className="text-sm text-error mt-1">{errors.testcases[idx].input.message}</p>}
                      </div>
                      <div>
                        <label className="label"><span className="label-text">Expected Output</span></label>
                        <textarea className="textarea textarea-bordered min-h-20 bg-white text-black" {...register(`testcases.${idx}.output`)} />
                        {errors.testcases?.[idx]?.output && <p className="text-sm text-error mt-1">{errors.testcases[idx].output.message}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editors */}
            {["JAVASCRIPT", "PYTHON", "JAVA"].map((language) => (
              <div key={language} className="card bg-gray-50 border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2"><Code2 /> <h4 className="font-medium">{language}</h4></div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label"><span className="label-text">Starter Code</span></label>
                    <div className="border rounded overflow-hidden">
                      <Controller name={`codeSnippets.${language}`} control={control} render={({ field }) => (
                        <Editor height="220px" language={language.toLowerCase()} theme="vs-dark" value={field.value} onChange={field.onChange} options={{ minimap: { enabled: false }, fontSize: 13, automaticLayout: true }} />
                      )} />
                    </div>
                    {errors.codeSnippets?.[language] && <p className="text-sm text-error mt-1">{errors.codeSnippets[language].message}</p>}
                  </div>

                  <div>
                    <label className="label"><span className="label-text">Reference Solution</span></label>
                    <div className="border rounded overflow-hidden">
                      <Controller name={`referenceSolutions.${language}`} control={control} render={({ field }) => (
                        <Editor height="220px" language={language.toLowerCase()} theme="vs-dark" value={field.value} onChange={field.onChange} options={{ minimap: { enabled: false }, fontSize: 13, automaticLayout: true }} />
                      )} />
                    </div>
                    {errors.referenceSolutions?.[language] && <p className="text-sm text-error mt-1">{errors.referenceSolutions[language].message}</p>}
                  </div>

                  <div>
                    <label className="label"><span className="label-text">Example</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <textarea className="textarea textarea-bordered bg-white text-black" {...register(`examples.${language}.input`)} placeholder="Example input" />
                      <textarea className="textarea textarea-bordered bg-white text-black" {...register(`examples.${language}.output`)} placeholder="Example output" />
                      <textarea className="md:col-span-2 textarea textarea-bordered bg-white text-black" {...register(`examples.${language}.explanation`)} placeholder="Explanation" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Additional */}
            <div className="card bg-gray-50 border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3"><Lightbulb /> <h3 className="font-medium">Additional Information</h3></div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="label"><span className="label-text">Constraints</span></label>
                  <textarea className="textarea textarea-bordered bg-white text-black" {...register("constraints")} />
                  {errors.constraints && <p className="text-sm text-error mt-1">{errors.constraints.message}</p>}
                </div>

                <div>
                  <label className="label"><span className="label-text">Hints</span></label>
                  <textarea className="textarea textarea-bordered bg-white text-black" {...register("hints")} />
                </div>

                <div>
                  <label className="label"><span className="label-text">Editorial</span></label>
                  <textarea className="textarea textarea-bordered bg-white text-black min-h-[120px]" {...register("editorial")} />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                {isLoading ? <span className="loading loading-spinner" /> : <><CheckCircle2 className="w-4 h-4 mr-2"/> {isEdit ? "Update Problem" : "Create Problem"}</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditProblem;
