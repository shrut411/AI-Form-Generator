import React, { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSchema = async (ev) => {
    ev && ev.preventDefault();
    setError("");
    setSchema(null);
    if (!prompt.trim()) {
      setError("Please enter a form description.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/generate-schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(JSON.stringify(data));
      } else {
        setSchema(data.schema);
      }
    } catch (err) {
      setError("Request failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async ({ formData }) => {
    try {
      const r = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const j = await r.json();
      alert("Saved: " + JSON.stringify(j));
    } catch (err) {
      alert("Submit failed: " + err.message);
    }
  };

  // small sample schema to show something before first generation
  const sampleSchema = {
    title: "Patient Form (sample)",
    type: "object",
    properties: {
      sampleName: { type: "string", title: "Sample Name" },
      sampleAge: { type: "integer", title: "Sample Age" }
    },
    required: ["sampleName"]
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>AI Form Creator (Local)</h1>

      <form onSubmit={generateSchema} style={{ marginBottom: 20 }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Example: "Create a nursing form with patient name (text), DOB (date), allergies (textarea), vitals: temp (number), pulse (integer), and signature."'
          rows={4}
          style={{ width: "100%", padding: 12 }}
        />
        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Form"}
          </button>
        </div>
      </form>

      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

      <div style={{ marginTop: 20 }}>
        {schema ? (
          <>
            <h2>{schema.title || "Generated Form"}</h2>
            <Form schema={schema} validator={validator} onSubmit={handleSubmit} />
          </>
        ) : (
          <>
            <h2>Sample Form</h2>
            <Form schema={sampleSchema} validator={validator} onSubmit={({ formData }) => alert(JSON.stringify(formData))} />
            <div style={{ color: "#666", marginTop: 12 }}>Enter a description above and click Generate to create a new form from the LLM.</div>
          </>
        )}
      </div>
    </div>
  );
}
