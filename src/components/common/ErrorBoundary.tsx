import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.bg.primary,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: Spacing.lg,
          }}
        >
          <View
            style={{
              backgroundColor: Colors.bg.surface,
              borderRadius: 12,
              padding: Spacing.lg,
              borderWidth: 1,
              borderColor: Colors.status.error,
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSizes.lg,
                fontWeight: Typography.fontWeights.bold,
                color: Colors.status.error,
                marginBottom: Spacing.md,
              }}
            >
              Something Went Wrong
            </Text>
            <Text
              style={{
                fontSize: Typography.fontSizes.md,
                color: Colors.text.secondary,
                marginBottom: Spacing.md,
              }}
            >
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            <TouchableOpacity
              onPress={this.resetError}
              style={{
                backgroundColor: Colors.accent.primary,
                paddingVertical: Spacing.md,
                paddingHorizontal: Spacing.lg,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: Colors.text.inverse,
                  fontWeight: Typography.fontWeights.semibold,
                }}
              >
                TRY AGAIN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
