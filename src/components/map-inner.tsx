"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPin {
  id: number;
  name: string;
  city: string | null;
  country: string;
  status: string;
  lat: number;
  lng: number;
}

const STATUS_STYLES: Record<string, { color: string; fillColor: string; fillOpacity: number }> = {
  wishlist: { color: "#1A1A1A", fillColor: "transparent", fillOpacity: 0 },
  planned: { color: "#EBCFBE", fillColor: "#EBCFBE", fillOpacity: 0.8 },
  visited: { color: "#1A1A1A", fillColor: "#1A1A1A", fillOpacity: 0.8 },
};

export default function MapInner({ pins, viewLabel = "View →" }: { pins: MapPin[]; viewLabel?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 12,
      scrollWheelZoom: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png").addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when pins change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add new markers
    for (const pin of pins) {
      const style = STATUS_STYLES[pin.status] || STATUS_STYLES.wishlist;
      const marker = L.circleMarker([pin.lat, pin.lng], {
        radius: 7,
        color: style.color,
        fillColor: style.fillColor,
        fillOpacity: style.fillOpacity,
        weight: 1.5,
      }).addTo(map);

      const location = [pin.city, pin.country].filter(Boolean).join(", ");
      marker.bindPopup(
        `<div style="text-align:center;min-width:120px;font-family:system-ui,sans-serif;">` +
          `<p style="font-family:'Playfair Display',Georgia,serif;font-size:14px;margin:0 0 2px;">${pin.name}</p>` +
          `<p style="font-size:10px;color:rgba(26,26,26,0.4);margin:0 0 8px;">${location}</p>` +
          `<a href="/bucket-list/${pin.id}" style="font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(26,26,26,0.5);text-decoration:none;">${viewLabel}</a>` +
        `</div>`,
        { closeButton: false, className: "myra-popup" }
      );

      markersRef.current.push(marker);
    }

    // Fit bounds if we have pins
    if (pins.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.3), { maxZoom: 6 });
    }
  }, [pins]);

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}
