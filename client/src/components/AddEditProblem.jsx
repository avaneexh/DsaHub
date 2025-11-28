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
    description: "You are climbing a staircase. It takes n steps to reach the top...",
    difficulty: "EASY",
    tags: ["Dynamic Programming", "Math"],
    constraints: "1 <= n <= 45",
    hints: "Think fibonacci",
    editorial: "DP solution...",
    testcases: [{ input: "2", output: "2" }],
    examples: blankDefaults.examples,
    codeSnippets: blankDefaults.codeSnippets,
    referenceSolutions: blankDefaults.referenceSolutions,
  };

  const sampleStringProblem = {
    title: "Valid Palindrome",
    description: "Check if string is palindrome after cleaning...",
    difficulty: "EASY",
    tags: ["String", "Two Pointers"],
    constraints: "1 <= s.length <= 2e5",
    hints: "Use two pointers",
    editorial: "Two pointer approach",
    testcases: [{ input: "A man, a plan, a canal: Panama", output: "true" }],
    examples: blankDefaults.examples,
    codeSnippets: blankDefaults.codeSnippets,
    referenceSolutions: blankDefaults.referenceSolutions,
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
