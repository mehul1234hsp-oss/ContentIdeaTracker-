// frontend/src/components/EditIdeaPage.js
import { useState, useEffect } from "react";
import { getUploadUrl, uploadImageToS3 } from "../services/api";

const C = {
    bg: "#fdf6f0", surface: "#ffffff", surf2: "#f5ece4", border: "#ede8e3",
    text: "#1a1a2e", muted: "#a0a0b0", muted2: "#6b6b80", accent: "#E8334A",
};

const P = {
    Instagram: { c: "#e1306c", bg: "rgba(225,48,108,0.12)" },
    LinkedIn: { c: "#0a66c2", bg: "rgba(10,102,194,0.12)" },
    Twitter: { c: "#1d9bf0", bg: "rgba(29,155,240,0.12)" },
    YouTube: { c: "#ff3b30", bg: "rgba(255,59,48,0.12)" },
    Facebook: { c: "#1877f2", bg: "rgba(24,119,242,0.12)" },
    TikTok: { c: "#25f4ee", bg: "rgba(37,244,238,0.12)" },
    WhatsApp: { c: "#25d366", bg: "rgba(37,211,102,0.12)" },
};

const btn = (extra = {}) => ({
    border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif",
    fontWeight: 700, borderRadius: 8, transition: "all 0.18s", ...extra,
});

export default function EditIdeaPage({ idea, onSave, onCancel }) {
    const [editName, setEditName] = useState(idea?.name || "");
    const [editText, setEditText] = useState(idea?.text || "");
    const [editChannel, setEditChannel] = useState(idea?.channel || "Instagram");
    const [editLinks, setEditLinks] = useState(idea?.links || []);
    const [editImages, setEditImages] = useState(
        (idea?.images || []).map(url => ({ preview: url, file: null }))
    );
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [newLinkInput, setNewLinkInput] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const handlePaste = (e) => {
            if (e.clipboardData && e.clipboardData.items) {
                for (let i = 0; i < e.clipboardData.items.length; i++) {
                    if (e.clipboardData.items[i].type.indexOf("image") !== -1) {
                        const file = e.clipboardData.items[i].getAsFile();
                        handleImagePick(file);
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
        setEditImages(prev => [...prev, { preview: url, file }]);
    };
    const removeEditImage = (idx) => setEditImages(prev => prev.filter((_, i) => i !== idx));

    const handleAddLink = () => {
        // Split on whitespace so multiple pasted URLs each become their own entry
        const urls = newLinkInput.trim().split(/\s+/).filter(Boolean);
        if (urls.length) {
            setEditLinks(prev => [...prev, ...urls]);
            setNewLinkInput("");
        }
    };
    const removeEditLink = (idx) => setEditLinks(prev => prev.filter((_, i) => i !== idx));

    const handleSaveEdit = async () => {
        if (!editText.trim()) return;
        setSaving(true);
        try {
            const finalImageUrls = [];
            for (const img of editImages) {
                if (img.file) {
                    const { uploadUrl, fileUrl } = await getUploadUrl(
                        img.file.name || "pasted-image.png", img.file.type || "image/png"
                    );
                    await uploadImageToS3(uploadUrl, img.file);
                    finalImageUrls.push(fileUrl);
                } else {
                    finalImageUrls.push(img.preview);
                }
            }
            await onSave(idea.id, {
                name: editName.trim(),
                text: editText.trim(), channel: editChannel,
                links: editLinks, images: finalImageUrls
            });
        } catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save edits.");
            setSaving(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: C.bg, color: C.text, fontFamily: "Inter,sans-serif" }}>
            {/* ── Glassmorphic nav strip ── */}
            <nav style={{
                height: 64, flexShrink: 0,
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                borderBottom: "1px solid rgba(237,232,227,0.9)",
                display: "flex", alignItems: "center",
                padding: "0 28px", gap: 16,
                position: "sticky", top: 0, zIndex: 10,
            }}>
                {/* Cancel */}
                <button
                    onClick={onCancel}
                    style={btn({
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 18px", borderRadius: 999,
                        background: "rgba(255,255,255,0.7)",
                        border: "1.5px solid rgba(180,170,160,0.5)",
                        color: "#3a3a5c",
                        fontSize: ".82rem", letterSpacing: ".2px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    })}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#b4aaa0"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(180,170,160,0.5)"; }}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    Cancel
                </button>

                <div style={{ flex: 1, textAlign: "center", fontWeight: 800, fontSize: "1.25rem", color: C.text, letterSpacing: "-.4px" }}>
                    Edit Idea
                </div>

                {/* Save Changes */}
                <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    style={btn({
                        padding: "8px 22px", borderRadius: 999,
                        background: saving ? "#c0c0c0" : "linear-gradient(135deg, #E8334A, #ff6347)",
                        color: "#fff", fontSize: ".82rem", letterSpacing: ".3px",
                        boxShadow: saving ? "none" : "0 4px 18px rgba(232,51,74,0.38), 0 1px 4px rgba(232,51,74,0.2)",
                        opacity: saving ? 0.7 : 1, border: "none",
                    })}
                    onMouseEnter={e => { if (!saving) e.currentTarget.style.boxShadow = "0 6px 24px rgba(232,51,74,0.5), 0 2px 6px rgba(232,51,74,0.25)"; }}
                    onMouseLeave={e => { if (!saving) e.currentTarget.style.boxShadow = "0 4px 18px rgba(232,51,74,0.38), 0 1px 4px rgba(232,51,74,0.2)"; }}
                >
                    {saving ? "Saving…" : "Save Changes"}
                </button>
            </nav>

            <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "30px 20px", overflowY: "auto" }}>
                <div style={{ width: "100%", maxWidth: "700px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "30px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <div style={{ fontSize: ".75rem", fontWeight: 700, color: C.muted2, textTransform: "uppercase", marginBottom: 8, letterSpacing: 1 }}>Idea Name</div>
                        <input
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            placeholder="e.g. AWS Cost Optimization post..."
                            style={{ width: "100%", padding: "14px", border: `1.5px solid ${C.border}`, borderRadius: 12, fontFamily: "Inter,sans-serif", fontSize: "1.05rem", color: C.text, outline: "none" }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <div style={{ fontSize: ".75rem", fontWeight: 700, color: C.muted2, textTransform: "uppercase", marginBottom: 8, letterSpacing: 1 }}>Idea Content</div>
                        <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={6}
                            style={{ width: "100%", padding: "16px", border: `1.5px solid ${C.border}`, borderRadius: 12, fontFamily: "Inter,sans-serif", fontSize: "1.05rem", color: C.text, outline: "none" }} />
                    </div>

                    <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: "200px" }}>
                            <div style={{ fontSize: ".75rem", fontWeight: 700, color: C.muted2, textTransform: "uppercase", marginBottom: 8, letterSpacing: 1 }}>Platform</div>
                            <select value={editChannel} onChange={e => setEditChannel(e.target.value)}
                                style={{ width: "100%", padding: "14px", border: `1.5px solid ${C.border}`, borderRadius: 12, fontFamily: "Inter,sans-serif", fontSize: ".95rem", fontWeight: 600, color: C.text, outline: "none", cursor: "pointer" }}>
                                {Object.keys(P).map(ch => <option key={ch} value={ch}>{ch}</option>)}
                            </select>
                        </div>

                        <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: 10, justifyContent: "flex-end" }}>
                            <button onClick={() => setShowLinkInput(!showLinkInput)} style={btn({ padding: "14px", background: C.surf2, color: C.text })}>🔗 Add Link</button>
                            <label style={btn({ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px", background: C.surf2, color: C.text })}>
                                📸 Add Image
                                <input type="file" multiple accept="image/png, image/jpeg, image/webp" style={{ display: "none" }}
                                    onChange={e => { if (e.target.files) Array.from(e.target.files).forEach(handleImagePick); e.target.value = null; }} />
                            </label>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                        {editLinks.map((lnk, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", background: C.surf2, padding: "12px 16px", borderRadius: "10px", fontSize: "0.9rem" }}>
                                <span style={{ flex: 1, whiteSpace: "pre-wrap" }}>{lnk}</span>
                                <button type="button" onClick={() => removeEditLink(i)} style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontWeight: "bold" }}>✕</button>
                            </div>
                        ))}
                        {showLinkInput && (
                            <div style={{ display: "flex", gap: "8px" }}>
                                <input value={newLinkInput} onChange={e => setNewLinkInput(e.target.value)}
                                    style={{ flex: 1, padding: "12px", borderRadius: "10px", border: `1px solid ${C.border}`, background: "#fff", outline: "none" }} />
                                <button type="button" onClick={handleAddLink} style={btn({ padding: "0 20px", background: C.surface, border: `1.5px solid ${C.border}` })}>Add</button>
                            </div>
                        )}
                    </div>

                    {editImages.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                            {editImages.map((img, i) => (
                                <div key={i} style={{ position: "relative", width: "100px", height: "100px", borderRadius: "12px", overflow: "hidden", border: `2px solid ${C.border}` }}>
                                    <img src={img.preview} alt={`Upload ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    <button type="button" onClick={() => removeEditImage(i)}
                                        style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.65)", color: "#fff", border: "none", cursor: "pointer" }}>✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
