import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SmartDashboard } from '../../components/dashboard/SmartDashboard';

// Mock the Card component
vi.mock('../../components/primitives/Card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
}));

describe('SmartDashboard', () => {
  const defaultProps = {
    totalRevenue: 1500.50,
    monthlyGoal: 10000,
    aiInsight: 'Test AI insight message',
    isBriefingLoading: false,
    onRestock: vi.fn(),
    onAddCustomer: vi.fn(),
    onSchedulePost: vi.fn(),
  };

  it('renders without crashing', () => {
    render(<SmartDashboard {...defaultProps} />);
    expect(screen.getByText("Today's Revenue")).toBeInTheDocument();
  });

  it('displays correct revenue information', () => {
    render(<SmartDashboard {...defaultProps} />);
    expect(screen.getByText('RM1500.50')).toBeInTheDocument();
  });

  it('calculates and displays monthly progress correctly', () => {
    render(<SmartDashboard {...defaultProps} />);
    // 1500.50 / 10000 * 100 = 15.005% ≈ 15%
    expect(screen.getByText('15%')).toBeInTheDocument();
  });

  it('shows AI insight when not loading', () => {
    render(<SmartDashboard {...defaultProps} />);
    expect(screen.getByText('Test AI insight message')).toBeInTheDocument();
  });

  it('shows loading state for AI insight', () => {
    render(<SmartDashboard {...defaultProps} isBriefingLoading={true} />);
    expect(screen.getByText('AI Strategic Insight')).toBeInTheDocument();
    // Check for loading animation
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('calls onRestock when restock button is clicked', () => {
    const mockOnRestock = vi.fn();
    render(<SmartDashboard {...defaultProps} onRestock={mockOnRestock} />);
    
    const restockButton = screen.getByText('Restock');
    fireEvent.click(restockButton);
    
    expect(mockOnRestock).toHaveBeenCalledTimes(1);
  });

  it('calls onAddCustomer when add customer button is clicked', () => {
    const mockOnAddCustomer = vi.fn();
    render(<SmartDashboard {...defaultProps} onAddCustomer={mockOnAddCustomer} />);
    
    const addCustomerButton = screen.getByText('Add Customer');
    fireEvent.click(addCustomerButton);
    
    expect(mockOnAddCustomer).toHaveBeenCalledTimes(1);
  });

  it('calls onSchedulePost when schedule post button is clicked', () => {
    const mockOnSchedulePost = vi.fn();
    render(<SmartDashboard {...defaultProps} onSchedulePost={mockOnSchedulePost} />);
    
    const schedulePostButton = screen.getByText('Schedule Post');
    fireEvent.click(schedulePostButton);
    
    expect(mockOnSchedulePost).toHaveBeenCalledTimes(1);
  });

  it('renders collapsible sections', () => {
    render(<SmartDashboard {...defaultProps} />);
    expect(screen.getByText('Detailed Analytics')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });
});
