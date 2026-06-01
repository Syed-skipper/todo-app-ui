"use client";

import { Dialog, Portal, IconButton, Box } from "@chakra-ui/react";
import { HiXMark } from "react-icons/hi2";

export default function AppModal({ open, onClose, title, subtitle, children, footer, maxW = "480px" }) {
  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} placement="center">
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.600" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW={maxW}
            w="full"
            mx={4}
            borderRadius="20px"
            border="1px solid"
            borderColor="var(--border)"
            bg="var(--paper)"
            p={0}
          >
            <Box px={6} pt={5} pb={2} position="relative" pr={14}>
              <Dialog.Title fontSize="lg" fontWeight={600} color="var(--ink)">
                {title}
              </Dialog.Title>
              {subtitle && (
                <Dialog.Description mt={1} fontSize="sm" color="var(--ink-muted)">
                  {subtitle}
                </Dialog.Description>
              )}
              <IconButton
                aria-label="Close"
                variant="ghost"
                size="sm"
                position="absolute"
                right={3}
                top={3}
                onClick={onClose}
              >
                <HiXMark />
              </IconButton>
            </Box>
            <Box px={6} py={2}>
              {children}
            </Box>
            {footer && (
              <Box px={6} pb={5} pt={2} display="flex" gap={3}>
                {footer}
              </Box>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
