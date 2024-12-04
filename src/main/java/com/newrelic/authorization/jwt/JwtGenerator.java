package com.newrelic.authorization.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.JwtBuilder;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.nio.file.Files;
import java.nio.file.Paths;

public class JwtGenerator {

    private static final String APP_ID = "51"; // Replace with your actual App ID
    private static final long JWT_TTL = 600000; // 10 minutes validity

    public static String getJwtToken(String keyPath) throws Exception {
        // Load the private key from a file
        byte[] keyBytes = Files.readAllBytes(Paths.get(keyPath));

        // Remove the first and last lines
        String privateKeyPEM = new String(keyBytes)
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");

        byte[] decodedKey = Base64.getDecoder().decode(privateKeyPEM);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decodedKey);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PrivateKey privateKey = keyFactory.generatePrivate(spec);

        // Define JWT parameters
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);

        JwtBuilder builder = Jwts.builder()
                .setIssuedAt(now)
                .setIssuer(APP_ID)
                .setExpiration(new Date(nowMillis + JWT_TTL))
                .signWith(privateKey, SignatureAlgorithm.RS256);

        // Serialize the JWT to a compact, URL-safe JWT string
        return builder.compact();
    }
}