import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { request } from "../services/api.jsx";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setError("");
      setIsLoading(true);

      try {
        const data = await request("/products", { auth: true, token });
        const product = data.find((item) => item._id === id);

        if (!product) {
          setError("Product not found.");
          return;
        }

        setName(product.name);
        setPrice(String(product.price));
        setDescription(product.description);
      } catch (requestError) {
        if (requestError.status === 401) {
          logout();
          navigate("/login", { replace: true });
          return;
        }

        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, logout, navigate, token]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await request(`/products/${id}`, {
        method: "PUT",
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
            <h1>Edit product</h1>
            <p className="page-copy">
              Update the saved values and return to the dashboard.
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

        {isLoading ? <p className="empty-state">Loading product...</p> : null}

        {!isLoading ? (
          <form className="form-grid" onSubmit={submit}>
            <label className="field">
              <span>Name</span>
              <input
                type="text"
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
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </label>

            <label className="field">
              <span>Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows="4"
                required
              />
            </label>

            {error ? <p className="message error-message">{error}</p> : null}

            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting || Boolean(error && error === "Product not found.")}
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
          </form>
        ) : null}
      </section>
    </main>
  );
}
