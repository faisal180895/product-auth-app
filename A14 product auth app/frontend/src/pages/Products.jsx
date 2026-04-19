import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { request } from "../services/api.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { token, logout } = useAuth();

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        const data = await request("/products", { auth: true, token });

        if (!isActive) {
          return;
        }

        setProducts(Array.isArray(data) ? data : []);
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        if (requestError.status === 401) {
          logout();
          navigate("/login", { replace: true });
          return;
        }

        setError(requestError.message);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isActive = false;
    };
  }, [logout, navigate, token]);

  const deleteProduct = async (id) => {
    setError("");

    try {
      await request(`/products/${id}`, {
        method: "DELETE",
        auth: true,
        token,
      });

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== id),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <main className="page-shell">
      <section className="panel dashboard-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Protected area</p>
            <h1>Products</h1>
            <p className="page-copy">
              Manage your catalog after logging in.
            </p>
          </div>

          <div className="header-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => navigate("/add-product")}
            >
              Add Product
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {error ? <p className="message error-message">{error}</p> : null}

        {isLoading ? <p className="empty-state">Loading products...</p> : null}

        {!isLoading && !error && products.length === 0 ? (
          <div className="empty-card">
            <h2>No products yet</h2>
            <p>Add your first product to get started.</p>
          </div>
        ) : null}

        {!isLoading && products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product._id}>
                <div className="product-meta">
                  <h2>{product.name}</h2>
                  <span className="price-tag">${product.price}</span>
                </div>
                <p>{product.description}</p>
                <div className="card-actions">
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="danger-button"
                    type="button"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
