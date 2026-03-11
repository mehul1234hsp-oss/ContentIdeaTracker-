import { useState, useEffect } from "react";
import { getUploadUrl, uploadImageToS3 } from "../services/api"; // Added S3 imports

function IdeaForm({ onCreate, onCancel }) {
  const [text, setText] = useState("");
  const [channel, setChannel] = useState("LinkedIn");
  const [status, setStatus] = useState("idea");
  const [showLink, setShowLink] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [links, setLinks] = useState([]);

  const [showImage, setShowImage] = useState(false);
  const [images, setImages] = useState([]); // array of { id, file, preview }
  const [submitting, setSubmitting] = useState(false);

  // Handle Ctrl+V Paste anywhere in the form
  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const file = items[i].getAsFile();
            handleImagePick(file);
            setShowImage(true);
            e.preventDefault();
            break;
          }
        }
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  const handleImagePick = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages(prev => [...prev, { id: Date.now() + Math.random(), file, preview: url }]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleAddLink = () => {
    if (linkInput.trim()) {
      setLinks(prev => [...prev, linkInput.trim()]);
      setLinkInput("");
    }
  };

  const removeLink = (idx) => {
    setLinks(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (typeof onCreate !== "function") return;

    try {
      setSubmitting(true);
      let finalLinks = [...links];
      if (linkInput.trim()) finalLinks.push(linkInput.trim());

      // --- AWS S3 UPLOAD LOGIC STARTS HERE ---
      const finalImageUrls = [];
      for (const img of images) {
        if (img.file) {
          // Ask backend for a secure URL
          const { uploadUrl, fileUrl } = await getUploadUrl(
            img.file.name || "pasted-image.png",
            img.file.type || "image/png"
          );
          // Upload the actual file directly to AWS S3
          await uploadImageToS3(uploadUrl, img.file);
          // Add the permanent public URL to our database list
          finalImageUrls.push(fileUrl);
        }
      }
      // --- AWS S3 UPLOAD LOGIC ENDS HERE ---

      // Create the idea using the permanent S3 links!
      await onCreate({
        text: text.trim(),
        channel,
        status,
        links: finalLinks,
        images: finalImageUrls
      });

      setText("");
      setLinkInput("");
      setLinks([]);
      setImages([]);
      setStatus("idea");
      setShowLink(false);
      setShowImage(false);
    } catch (error) {
      console.error("Failed to submit idea or upload image:", error);
      alert("Failed to save idea. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

      {/* Idea Input */}
      <div>
        <label style={{
          display: "block",
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          color: "var(--text-secondary)",
          marginBottom: "8px",
        }}>
          Your Idea
        </label>
        <textarea
          placeholder="e.g. Post about AWS cost optimization tips..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitting}
          rows={4}
          style={{
            width: "100%",
            background: "var(--cream)",
            border: "1.5px solid var(--border)",
            borderRadius: "12px",
            padding: "16px",
            color: "var(--text-primary)",
            fontSize: "0.95rem",
            fontFamily: "Inter, sans-serif",
            lineHeight: 1.6,
            outline: "none",
            resize: "vertical",
            transition: "all 0.2s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--accent)";
            e.target.style.background = "var(--white)";
            e.target.style.boxShadow = "0 0 0 3px rgba(232,51,74,0.10)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
            e.target.style.background = "var(--cream)";
            e.target.style.boxShadow = "none";
          }}
        />

        {/* Action Bar for Link / Image Attachments */}
        <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
          <button
            type="button"
            onClick={() => setShowLink(!showLink)}
            style={{
              background: showLink ? "rgba(232,51,74,0.1)" : "var(--white)",
              border: `1px solid ${showLink ? "rgba(232,51,74,0.3)" : "var(--border)"}`,
              color: showLink ? "var(--accent)" : "var(--text-secondary)",
              padding: "6px 14px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
              cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", gap: "6px"
            }}
          >
            🔗 Add Link
          </button>
          <button
            type="button"
            onClick={() => setShowImage(!showImage)}
            style={{
              background: showImage ? "rgba(232,51,74,0.1)" : "var(--white)",
              border: `1px solid ${showImage ? "rgba(232,51,74,0.3)" : "var(--border)"}`,
              color: showImage ? "var(--accent)" : "var(--text-secondary)",
              padding: "6px 14px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
              cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", gap: "6px"
            }}
          >
            Add Image
          </button>
        </div>

        {/* Link Input Field */}
        <div style={{
          marginTop: showLink || links.length > 0 ? "12px" : "0",
          maxHeight: showLink || links.length > 0 ? "500px" : "0",
          opacity: showLink || links.length > 0 ? 1 : 0,
          overflow: "hidden",
          transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex", flexDirection: "column", gap: "8px"
        }}>
          {links.map((lnk, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", background: "var(--cream)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.8rem", border: "1px solid var(--border)" }}>
              <span style={{ flex: 1, whiteSpace: "pre-wrap", color: "var(--text-primary)", lineHeight: 1.4 }}>{lnk}</span>
              <button type="button" onClick={() => removeLink(i)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
          ))}
          {showLink && (
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <textarea
                placeholder="https://example.com/reference&#10;Add description here..."
                value={linkInput}
                onChange={e => setLinkInput(e.target.value)}
                rows={2}
                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); handleAddLink(); } }}
                style={{
                  flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1.5px solid var(--border)",
                  background: "var(--white)", fontSize: "0.85rem", color: "var(--text-primary)", outline: "none",
                  resize: "vertical", fontFamily: "inherit"
                }}
              />
              <button type="button" onClick={handleAddLink} style={{ height: "fit-content", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "8px", padding: "8px 14px", fontWeight: "600", fontSize: "0.8rem", cursor: "pointer", color: "var(--text-primary)" }}>Add</button>
            </div>
          )}
        </div>

        {/* Image Input Field */}
        <div style={{
          marginTop: showImage || images.length > 0 ? "8px" : "0",
          maxHeight: showImage || images.length > 0 ? "240px" : "0",
          opacity: showImage || images.length > 0 ? 1 : 0,
          overflowY: "auto",
          overflowX: "hidden",
          transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex", flexDirection: "column", gap: "8px",
          paddingRight: "4px"
        }}>
          {images.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "8px" }}>
              {images.map(img => (
                <div key={img.id} style={{ position: "relative", width: "100%", height: 100, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
                  <img src={img.preview} alt="Attached idea" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    style={{
                      position: "absolute", top: 4, right: 4, width: 24, height: 24, borderRadius: "50%",
                      background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem"
                    }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          {(showImage || images.length === 0) && (
            <label style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              width: "100%", height: 100, border: "1.5px dashed var(--accent)", borderRadius: 12,
              background: "rgba(232,51,74,0.04)", color: "var(--accent)", fontSize: "0.85rem", fontWeight: 600,
              cursor: "pointer", transition: "all .2s", marginTop: images.length > 0 ? "4px" : "0"
            }}>
              <span style={{ fontSize: "1.6rem", marginBottom: 2, fontWeight: 300 }}>+</span>
              Click to upload or Ctrl+V to paste
              <input
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                style={{ display: "none" }}
                onChange={e => {
                  if (e.target.files) {
                    Array.from(e.target.files).forEach(file => handleImagePick(file));
                  }
                  e.target.value = null; // reset input
                }}
              />
            </label>
          )}
        </div>

      </div>

      {/* Channel Select */}
      <div>
        <label style={{
          display: "block",
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          color: "var(--text-secondary)",
          marginBottom: "8px",
        }}>
          Channel
        </label>
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          disabled={submitting}
          style={{
            width: "100%",
            background: "var(--cream)",
            border: "1.5px solid var(--border)",
            borderRadius: "12px",
            padding: "12px 16px",
            color: "var(--text-primary)",
            fontSize: "0.9rem",
            fontFamily: "inherit",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="LinkedIn">LinkedIn</option>
          <option value="Twitter">Twitter</option>
          <option value="Instagram">Instagram</option>
          <option value="Facebook">Facebook</option>
          <option value="TikTok">TikTok</option>
          <option value="YouTube">YouTube</option>
          <option value="WhatsApp">WhatsApp</option>
        </select>
      </div>

      {/* Status Select */}
      <div>
        <label style={{
          display: "block",
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          color: "var(--text-secondary)",
          marginBottom: "8px",
        }}>
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={submitting}
          style={{
            width: "100%",
            background: "var(--cream)",
            border: "1.5px solid var(--border)",
            borderRadius: "12px",
            padding: "12px 16px",
            color: "var(--text-primary)",
            fontSize: "0.9rem",
            fontFamily: "inherit",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="idea">💡 Idea</option>
          <option value="draft">✏️ Draft</option>
          <option value="published">✅ Published</option>
        </select>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>

        {typeof onCancel === "function" && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "13px",
              borderRadius: "12px",
              border: "1.5px solid var(--border)",
              background: "var(--cream)",
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={submitting || !text.trim()}
          style={{
            flex: 2,
            padding: "13px",
            borderRadius: "12px",
            border: "none",
            background: submitting || !text.trim() ? "#f8a4ae" : "var(--accent)",
            color: "white",
            fontSize: "0.875rem",
            fontWeight: 700,
            cursor: submitting || !text.trim() ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            boxShadow: "var(--shadow-btn)",
            transition: "all 0.2s",
          }}
        >
          {submitting ? "Uploading & Saving..." : "Save Idea →"}
        </button>

      </div>
    </form>
  );
}

export default IdeaForm;
