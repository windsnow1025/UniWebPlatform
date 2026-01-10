import React, {useEffect, useState} from "react";
import {Button, Card, CardActions, CardContent, CircularProgress, Paper, Typography,} from "@mui/material";
import Head from "next/head";
import PaymentLogic from "../../lib/payment/PaymentLogic";
import CreditSection from "../../components/common/settings/auth/signed-in/CreditSection";

function Purchase() {
  const [products, setProducts] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [error, setError] = useState(null);

  const paymentLogic = new PaymentLogic();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await paymentLogic.fetchProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handlePurchase = async (productId) => {
    setPurchasing(productId);
    setError(null);

    try {
      const checkoutUrl = await paymentLogic.createCheckout(productId);
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err.message);
      setPurchasing(null);
    }
  };

  const productEntries = Object.entries(products);

  return (
    <div className="local-scroll-container">
      <Head>
        <title>Purchase Credit - Windsnow1025</title>
      </Head>
      <div className="local-scroll-scrollable flex-center">
        <Paper elevation={3} className="p-6" sx={{maxWidth: 600}}>
          <Typography variant="h5" gutterBottom>
            Purchase Credit
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
            1 Credit = 1 USD. Select a package below to purchase.
          </Typography>

          <CreditSection decimalPlaces={2}/>

          {loadingProducts ? (
            <div style={{textAlign: "center", marginTop: "24px"}}>
              <CircularProgress/>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "24px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {productEntries.map(([productId, credit]) => (
                <Card key={productId} sx={{minWidth: 140}}>
                  <CardContent>
                    <Typography variant="h6">${credit}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {credit} Credits
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={purchasing !== null}
                      onClick={() => handlePurchase(productId)}
                    >
                      {purchasing === productId ? (
                        <CircularProgress size={24}/>
                      ) : (
                        "Buy"
                      )}
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <Typography color="error" sx={{mt: 2}}>
              {error}
            </Typography>
          )}
        </Paper>
      </div>
    </div>
  );
}

export default Purchase;
