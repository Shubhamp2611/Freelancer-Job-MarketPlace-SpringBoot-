package com.marketplace.contract;

import java.time.LocalDateTime;

import com.marketplace.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "contract_messages")
public class ContractMessage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    
    @Column(nullable = false)
    private LocalDateTime sendAt = LocalDateTime.now();
    
    private Boolean isRead = false;
    private LocalDateTime readAt;
    
    // For file attachments (store file paths or use separate table)
    private String attachmentUrl;
    private String attachmentName;
    
    // Message type
    @Enumerated(EnumType.STRING)
    private MessageType type = MessageType.TEXT;

	public ContractMessage() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ContractMessage(Contract contract, User sender, String message, LocalDateTime sendAt, Boolean isRead,
			LocalDateTime readAt, String attachmentUrl, String attachmentName, MessageType type) {
		super();
		this.contract = contract;
		this.sender = sender;
		this.message = message;
		this.sendAt = sendAt;
		this.isRead = isRead;
		this.readAt = readAt;
		this.attachmentUrl = attachmentUrl;
		this.attachmentName = attachmentName;
		this.type = type;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Contract getContract() {
		return contract;
	}

	public void setContract(Contract contract) {
		this.contract = contract;
	}

	public User getSender() {
		return sender;
	}

	public void setSender(User sender) {
		this.sender = sender;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public LocalDateTime getSendAt() {
		return sendAt;
	}

	public void setSendAt(LocalDateTime sendAt) {
		this.sendAt = sendAt;
	}

	public Boolean getIsRead() {
		return isRead;
	}

	public void setIsRead(Boolean isRead) {
		this.isRead = isRead;
	}

	public LocalDateTime getReadAt() {
		return readAt;
	}

	public void setReadAt(LocalDateTime readAt) {
		this.readAt = readAt;
	}

	public String getAttachmentUrl() {
		return attachmentUrl;
	}

	public void setAttachmentUrl(String attachmentUrl) {
		this.attachmentUrl = attachmentUrl;
	}

	public String getAttachmentName() {
		return attachmentName;
	}

	public void setAttachmentName(String attachmentName) {
		this.attachmentName = attachmentName;
	}

	public MessageType getType() {
		return type;
	}

	public void setType(MessageType type) {
		this.type = type;
	}
}
