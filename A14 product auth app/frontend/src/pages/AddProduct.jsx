import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { request } from "../services/api.jsx";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { token } = useAuth();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await request("/products", {
        method: "POST",
        auth: true,
        token,
        body: {
          name,
          price: Number(price),
          description,
        },
      });

      navigate("/products", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="panel form-panel">
        <div className="page-header compact-header">
          <div>
            <p className="eyebrow">Catalog</p>
            <h1>Add product</h1>
            <p className="page-copy">
              Create a new product entry for your dashboard.
            </p>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={() => navigate("/products")}
          >
            Back
          </button>
        </div>

        <form className="form-grid" onSubmit={submit}>
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              placeholder="Product name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Price</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="99.99"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              placeholder="Write a short description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows="4"
            />
          </label>

          {error ? <p className="message error-message">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Product"}
          </button>
        </form>
      </section>
    </main>
  );
}
